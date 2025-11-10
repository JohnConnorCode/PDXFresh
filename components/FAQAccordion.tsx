'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RichText } from './RichText';

interface FAQAccordionProps {
  faqs: any[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <motion.div
            key={faq._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
              isOpen
                ? 'border-accent-primary shadow-xl'
                : 'border-gray-200 shadow-md hover:border-accent-yellow hover:shadow-lg'
            }`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full p-6 flex items-start justify-between gap-4 text-left transition-colors"
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Question number badge */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isOpen
                      ? 'bg-accent-primary text-white scale-110'
                      : 'bg-gradient-to-br from-accent-yellow/30 to-accent-green/30 text-accent-primary'
                  }`}
                >
                  {index + 1}
                </div>

                <span className="font-heading text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                  {faq.question}
                </span>
              </div>

              {/* Toggle icon */}
              <motion.div
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3 }}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isOpen
                    ? 'bg-accent-primary text-white'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-accent-yellow/30'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </motion.div>
            </button>

            {/* Answer */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pl-[72px]">
                    <div className="prose prose-sm sm:prose-base prose-headings:font-heading prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed max-w-none">
                      <RichText value={faq.answer} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
