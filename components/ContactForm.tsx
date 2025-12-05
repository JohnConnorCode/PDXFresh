'use client';

import { useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData(initialFormData);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-accent-green/10 to-white rounded-2xl p-8 md:p-12 border-2 border-accent-green/30 shadow-lg text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-green/20 mb-4">
          <svg className="w-8 h-8 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-heading text-2xl font-bold mb-3 text-gray-900">Message Sent!</h3>
        <p className="text-gray-600 mb-6">Thank you for reaching out. We'll get back to you within 24-48 hours.</p>
        <button
          onClick={() => setStatus('idle')}
          className="px-6 py-2 bg-accent-primary text-white rounded-full font-medium hover:bg-accent-primary/90 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-accent-cream/30 to-white rounded-2xl p-8 md:p-12 border-2 border-gray-100 shadow-lg">
      <h2 className="font-heading text-3xl font-bold mb-6 text-gray-900 text-center">
        Send Us a Message
      </h2>

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent-primary focus:outline-none transition-colors"
              required
              disabled={status === 'submitting'}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent-primary focus:outline-none transition-colors"
              required
              disabled={status === 'submitting'}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent-primary focus:outline-none transition-colors"
            required
            disabled={status === 'submitting'}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent-primary focus:outline-none transition-colors"
            disabled={status === 'submitting'}
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent-primary focus:outline-none transition-colors"
            required
            disabled={status === 'submitting'}
          >
            <option value="">Select a topic...</option>
            <option value="general">General Inquiry</option>
            <option value="subscription">Subscription Question</option>
            <option value="wholesale">Wholesale Partnership</option>
            <option value="product">Product Information</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent-primary focus:outline-none transition-colors resize-none"
            required
            disabled={status === 'submitting'}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-green text-white rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {status === 'submitting' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
