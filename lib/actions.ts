'use server';

import { z } from 'zod';

// Newsletter subscription schema
const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Wholesale inquiry schema
const wholesaleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  expectedVolume: z.string().min(1, 'Please select an expected volume'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().optional(), // Bot protection
});

export async function submitNewsletter(formData: FormData) {
  const email = formData.get('email');

  try {
    const validatedData = newsletterSchema.parse({ email });

    // TODO: Integrate with email service provider (e.g., Mailchimp, SendGrid, ConvertKit)
    console.log('Newsletter signup:', validatedData);

    // Placeholder: In a real app, you would:
    // - Save to database
    // - Send confirmation email
    // - Integrate with ESP

    return {
      success: true,
      message: 'Thanks for subscribing! Check your email for confirmation.',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}

export async function submitWholesaleInquiry(formData: FormData) {
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company'),
    location: formData.get('location'),
    expectedVolume: formData.get('expectedVolume'),
    message: formData.get('message'),
    honeypot: formData.get('honeypot'),
  };

  // Check honeypot (bot protection)
  if (data.honeypot) {
    return {
      success: true,
      message: 'Thanks! We will review your inquiry.',
    };
  }

  try {
    const validatedData = wholesaleSchema.parse(data);

    // TODO: Integrate with email service or CRM
    console.log('Wholesale inquiry:', validatedData);

    // Placeholder: In a real app, you would:
    // - Save to database/CRM
    // - Send confirmation email
    // - Send notification to sales team

    return {
      success: true,
      message:
        'Thanks for your inquiry! Our team will review and respond within 2 business days.',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}
