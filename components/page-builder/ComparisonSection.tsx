import { Section } from '@/components/Section';
import { FadeIn } from '@/components/animations';
import { Check, X, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface Feature {
  name: string;
  tooltip?: string;
}

interface Column {
  name: string;
  description?: string;
  price?: string;
  featureValues: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  isHighlighted?: boolean;
}

interface ComparisonSectionProps {
  heading?: string;
  subheading?: string;
  features: Feature[];
  columns: Column[];
  backgroundColor?: string;
}

const bgColorMap: Record<string, string> = {
  white: 'bg-white',
  'accent-cream': 'bg-accent-cream',
  'gray-50': 'bg-gray-50',
};

function FeatureValue({ value }: { value: string }) {
  if (value === 'true') {
    return <Check className="w-5 h-5 text-accent-green mx-auto" />;
  }
  if (value === 'false') {
    return <X className="w-5 h-5 text-gray-300 mx-auto" />;
  }
  return <span className="text-sm text-gray-700">{value}</span>;
}

export function ComparisonSectionComponent({
  heading,
  subheading,
  features,
  columns,
  backgroundColor = 'white',
}: ComparisonSectionProps) {
  const bgClass = bgColorMap[backgroundColor] || 'bg-white';

  return (
    <Section className={bgClass}>
      {(heading || subheading) && (
        <FadeIn direction="up" className="text-center mb-12">
          {heading && (
            <h2 className="font-heading text-4xl font-bold mb-4">{heading}</h2>
          )}
          {subheading && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subheading}</p>
          )}
        </FadeIn>
      )}

      <FadeIn direction="up" delay={0.1}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            {/* Header */}
            <thead>
              <tr>
                <th className="text-left p-4 w-1/4"></th>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`text-center p-6 ${
                      column.isHighlighted
                        ? 'bg-accent-primary text-white rounded-t-xl'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="font-heading text-xl font-bold mb-1">
                      {column.name}
                    </div>
                    {column.description && (
                      <div
                        className={`text-sm mb-3 ${
                          column.isHighlighted ? 'text-white/80' : 'text-gray-500'
                        }`}
                      >
                        {column.description}
                      </div>
                    )}
                    {column.price && (
                      <div
                        className={`text-2xl font-bold ${
                          column.isHighlighted ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {column.price}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Features */}
            <tbody>
              {features.map((feature, featureIndex) => (
                <tr
                  key={featureIndex}
                  className={featureIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                >
                  <td className="p-4 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      {feature.name}
                      {feature.tooltip && (
                        <div className="group relative">
                          <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-10">
                            {feature.tooltip}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  {columns.map((column, columnIndex) => (
                    <td
                      key={columnIndex}
                      className={`text-center p-4 ${
                        column.isHighlighted
                          ? 'bg-accent-primary/5 border-l border-r border-accent-primary/20'
                          : ''
                      }`}
                    >
                      <FeatureValue
                        value={column.featureValues[featureIndex] || 'false'}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

            {/* CTAs */}
            <tfoot>
              <tr>
                <td className="p-4"></td>
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className={`text-center p-6 ${
                      column.isHighlighted
                        ? 'bg-accent-primary/5 border-l border-r border-b border-accent-primary/20 rounded-b-xl'
                        : ''
                    }`}
                  >
                    {column.ctaUrl && (
                      <Link
                        href={column.ctaUrl}
                        className={`inline-block px-6 py-3 rounded-full font-semibold transition-all ${
                          column.isHighlighted
                            ? 'bg-accent-primary text-white hover:opacity-90'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        {column.ctaLabel || 'Get Started'}
                      </Link>
                    )}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </FadeIn>
    </Section>
  );
}
