'use client';

import { useState } from 'react';
import { Section } from '@/components/Section';
import { FadeIn } from '@/components/animations';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  heading?: string;
  subheading?: string;
  faqs: FAQ[];
  backgroundColor?: string;
}

const bgColorMap: Record<string, string> = {
  white: 'bg-white',
  'accent-cream': 'bg-accent-cream',
  'accent-yellow/10': 'bg-accent-yellow/10',
  'accent-green/10': 'bg-accent-green/10',
};

export function FaqSectionComponent({
  heading,
  subheading,
  faqs,
  backgroundColor = 'white',
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const bgClass = bgColorMap[backgroundColor] || 'bg-white';

  return (
    <Section className={bgClass}>
      <div className="max-w-3xl mx-auto">
        {(heading || subheading) && (
          <FadeIn direction="up" className="text-center mb-12">
            {heading && (
              <h2 className="font-heading text-4xl font-bold mb-4">{heading}</h2>
            )}
            {subheading && (
              <p className="text-lg text-gray-600">{subheading}</p>
            )}
          </FadeIn>
        )}

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FadeIn key={index} direction="up" delay={index * 0.05}>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="p-5 pt-0 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  );
}
