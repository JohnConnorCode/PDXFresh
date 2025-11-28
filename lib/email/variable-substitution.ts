/**
 * Email Variable Substitution Utility
 *
 * Handles {{variable}} syntax in email templates with support for:
 * - Simple variables: {{variableName}}
 * - Nested objects: {{order.id}}
 * - Arrays with loops: {{#items}}...{{/items}}
 * - Conditionals: {{#if condition}}...{{/if}}
 * - Formatters: {{amount|currency}} or {{date|formatDate}}
 */

type DataValue = string | number | boolean | null | undefined | DataObject | DataValue[];
interface DataObject {
  [key: string]: DataValue;
}

/**
 * Format a value using a formatter
 */
function applyFormatter(value: DataValue, formatter: string): string {
  if (value === null || value === undefined) {
    return '';
  }

  switch (formatter) {
    case 'currency':
      // Assumes value is in cents
      const amount = typeof value === 'number' ? value : parseFloat(String(value));
      return isNaN(amount) ? String(value) : `$${(amount / 100).toFixed(2)}`;

    case 'formatDate':
      const date = new Date(String(value));
      return isNaN(date.getTime())
        ? String(value)
        : date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    case 'formatDateTime':
      const dateTime = new Date(String(value));
      return isNaN(dateTime.getTime())
        ? String(value)
        : dateTime.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          });

    case 'uppercase':
      return String(value).toUpperCase();

    case 'lowercase':
      return String(value).toLowerCase();

    case 'capitalize':
      return String(value).charAt(0).toUpperCase() + String(value).slice(1);

    case 'number':
      const num = typeof value === 'number' ? value : parseFloat(String(value));
      return isNaN(num) ? String(value) : num.toLocaleString();

    case 'percent':
      const pct = typeof value === 'number' ? value : parseFloat(String(value));
      return isNaN(pct) ? String(value) : `${pct}%`;

    default:
      return String(value);
  }
}

/**
 * Get a nested value from an object using dot notation
 */
function getNestedValue(obj: DataObject, path: string): DataValue {
  const parts = path.split('.');
  let current: DataValue = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (typeof current === 'object' && !Array.isArray(current)) {
      current = (current as DataObject)[part];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Process array loops: {{#items}}...{{/items}}
 */
function processLoops(template: string, data: DataObject): string {
  const loopRegex = /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;

  return template.replace(loopRegex, (_, arrayName, innerTemplate) => {
    const array = data[arrayName];

    if (!Array.isArray(array)) {
      return '';
    }

    return array
      .map((item, index) => {
        // Create context with item data and index
        const itemContext = typeof item === 'object' && item !== null ? { ...item, _index: index } : { _value: item, _index: index };
        return substituteVariables(innerTemplate, itemContext as DataObject);
      })
      .join('');
  });
}

/**
 * Process conditionals: {{#if condition}}...{{/if}} and {{#if condition}}...{{else}}...{{/if}}
 */
function processConditionals(template: string, data: DataObject): string {
  // Process if/else blocks
  const ifElseRegex = /\{\{#if (\w+(?:\.\w+)*)\}\}([\s\S]*?)\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g;
  template = template.replace(ifElseRegex, (_, condition, trueBlock, falseBlock) => {
    const value = getNestedValue(data, condition);
    return value ? trueBlock : falseBlock;
  });

  // Process simple if blocks
  const ifRegex = /\{\{#if (\w+(?:\.\w+)*)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  template = template.replace(ifRegex, (_, condition, block) => {
    const value = getNestedValue(data, condition);
    return value ? block : '';
  });

  return template;
}

/**
 * Main function to substitute variables in a template
 */
export function substituteVariables(template: string, data: DataObject): string {
  // Process loops first
  let result = processLoops(template, data);

  // Process conditionals
  result = processConditionals(result, data);

  // Process simple variables with optional formatters: {{variable|formatter}}
  const variableRegex = /\{\{(\w+(?:\.\w+)*)(?:\|(\w+))?\}\}/g;

  result = result.replace(variableRegex, (_, variablePath, formatter) => {
    const value = getNestedValue(data, variablePath);

    if (value === undefined || value === null) {
      return '';
    }

    if (formatter) {
      return applyFormatter(value, formatter);
    }

    return String(value);
  });

  return result;
}

/**
 * Extract all variable names from a template
 */
export function extractVariables(template: string): string[] {
  const variables = new Set<string>();

  // Simple variables
  const variableRegex = /\{\{(\w+(?:\.\w+)*)(?:\|\w+)?\}\}/g;
  let match;
  while ((match = variableRegex.exec(template)) !== null) {
    variables.add(match[1]);
  }

  // Loop variables
  const loopRegex = /\{\{#(\w+)\}\}/g;
  while ((match = loopRegex.exec(template)) !== null) {
    variables.add(match[1]);
  }

  // Conditional variables
  const condRegex = /\{\{#if (\w+(?:\.\w+)*)\}\}/g;
  while ((match = condRegex.exec(template)) !== null) {
    variables.add(match[1]);
  }

  return Array.from(variables);
}

/**
 * Generate sample data from a schema
 */
export function generateSampleData(schema: Record<string, any>): DataObject {
  const data: DataObject = {};

  for (const [key, type] of Object.entries(schema)) {
    if (typeof type === 'string') {
      switch (type) {
        case 'string':
          data[key] = `Sample ${key}`;
          break;
        case 'number':
          data[key] = 12345;
          break;
        case 'currency':
          data[key] = 4999; // $49.99 in cents
          break;
        case 'date':
          data[key] = new Date().toISOString();
          break;
        case 'boolean':
          data[key] = true;
          break;
        case 'email':
          data[key] = 'customer@example.com';
          break;
        default:
          data[key] = `[${key}]`;
      }
    } else if (Array.isArray(type)) {
      // Array type - generate sample array
      data[key] = [
        { name: 'Sample Item 1', quantity: 2, price: 2999 },
        { name: 'Sample Item 2', quantity: 1, price: 1999 },
      ];
    } else if (typeof type === 'object') {
      // Nested object - recurse
      data[key] = generateSampleData(type);
    }
  }

  return data;
}

/**
 * Validate a template against a schema
 */
export function validateTemplate(template: string, schema: Record<string, any>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const usedVariables = extractVariables(template);
  const schemaKeys = new Set(Object.keys(flattenSchema(schema)));

  for (const variable of usedVariables) {
    const rootKey = variable.split('.')[0];
    if (!schemaKeys.has(rootKey) && !['_index', '_value'].includes(rootKey)) {
      errors.push(`Variable "${variable}" is not defined in schema`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Flatten nested schema keys
 */
function flattenSchema(schema: Record<string, any>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(schema)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      result[key] = value;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenSchema(value, fullKey));
      result[key] = 'object';
    } else {
      result[key] = 'array';
    }
  }

  return result;
}
