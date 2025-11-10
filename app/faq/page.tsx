import { Metadata } from 'next';
import { client } from '@/lib/sanity.client';
import { faqQuery } from '@/lib/sanity.queries';
import { Section } from '@/components/Section';
import { RichText } from '@/components/RichText';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'FAQ | Long Life',
  description: 'Frequently asked questions about Long Life juices and ordering.',
};

async function getFAQs() {
  try {
    return await client.fetch(faqQuery);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

export default async function FAQPage() {
  const faqs = await getFAQs();

  return (
    <Section>
      <h1 className="font-heading text-5xl font-bold mb-4">Frequently Asked Questions</h1>
      <p className="text-lg text-muted mb-12 max-w-2xl">
        Find answers to common questions about our products and service.
      </p>

      {faqs.length > 0 ? (
        <div className="max-w-2xl space-y-6">
          {faqs.map((faq: any) => (
            <details
              key={faq._id}
              className="border border-gray-200 rounded-lg p-6 group open:bg-gray-50 transition-colors"
            >
              <summary className="cursor-pointer font-semibold flex items-center justify-between">
                <span>{faq.question}</span>
                <span className="text-xl group-open:rotate-180 transition-transform">
                  +
                </span>
              </summary>
              <div className="mt-4 text-muted">
                <RichText value={faq.answer} />
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted">No FAQs available at the moment.</p>
        </div>
      )}
    </Section>
  );
}
