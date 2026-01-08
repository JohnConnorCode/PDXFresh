import { Metadata } from 'next';
import { Section } from '@/components/Section';
import { FAQAccordion } from '@/components/FAQAccordion';
import { FadeIn } from '@/components/animations';
import { SmoothImage } from '@/components/SmoothImage';

export const metadata: Metadata = {
  title: 'FAQ | Portland Fresh',
  description: 'Frequently asked questions about Portland Fresh sauces, ordering, delivery, and subscriptions.',
};

// Hardcoded FAQs for Portland Fresh
const faqs = [
  {
    _id: '1',
    question: 'How long do your sauces stay fresh?',
    answer: 'Our sauces are made fresh weekly and stay delicious for 2-3 weeks refrigerated. Once opened, we recommend finishing within 7 days for peak flavor. All jars are date-labeled so you always know when it was made.',
    isFeatured: true,
  },
  {
    _id: '2',
    question: 'Where can I buy Portland Fresh sauces?',
    answer: 'You can find us at New Seasons Market locations across Portland, at the Portland Farmers Market (PSU on Saturdays), and through our weekly delivery service. We also offer Thursday pickup at our Buckman kitchen.',
    isFeatured: true,
  },
  {
    _id: '3',
    question: 'Do you offer delivery?',
    answer: 'Yes! We deliver across Portland every Thursday and Friday. Inner SE, NE, and downtown get bike delivery. Outer neighborhoods are served by our electric van. Delivery is free on orders over $35.',
    isFeatured: true,
  },
  {
    _id: '4',
    question: 'Are your sauces vegan or gluten-free?',
    answer: 'Most of our sauces are naturally gluten-free. Our pestos contain cheese (parmesan or pecorino), but we offer dairy-free versions of our chimichurri, zhug, and salsas. All products are clearly labeled with ingredients and allergens.',
    isFeatured: false,
  },
  {
    _id: '5',
    question: 'What sizes do you offer?',
    answer: 'We offer 7oz jars (perfect for 2 meals), 8oz containers, and 12oz jars for families or sauce lovers. Wholesale customers can order food-service trays and bulk containers.',
    isFeatured: false,
  },
  {
    _id: '6',
    question: 'How do I use the sauces?',
    answer: 'Our sauces are incredibly versatile! Toss pesto with pasta, spread chimichurri on grilled meats or veggies, use salsa for tacos or as a dip, and zhug adds heat to almost anything. Each jar includes serving suggestions.',
    isFeatured: false,
  },
  {
    _id: '7',
    question: 'Do you have a subscription service?',
    answer: 'We\'re launching subscriptions soon! Sign up for our newsletter to be first in line. Subscribers will get 15% off, priority access to limited releases, and free delivery.',
    isFeatured: false,
  },
  {
    _id: '8',
    question: 'Where do you source your ingredients?',
    answer: 'We source as locally as possible. Basil comes from Sauvie Island, peppers from the Willamette Valley, and we shop the Portland Farmers Market weekly. We use organic produce, olive oil (never seed oils), and fresh citrus.',
    isFeatured: false,
  },
  {
    _id: '9',
    question: 'Can I return my containers for reuse?',
    answer: 'Absolutely! We encourage jar returns. Bring clean jars to our Thursday pickup or any farmers market booth. We sanitize and reuse them, keeping packaging out of the landfill.',
    isFeatured: false,
  },
  {
    _id: '10',
    question: 'Do you cater events?',
    answer: 'Yes! We provide sauce bars, grazing boards, and bulk orders for events. Whether it\'s a wedding, corporate lunch, or pop-up dinner, we can customize a sauce spread. Contact us at hello@pdxfreshfoods.com for event inquiries.',
    isFeatured: false,
  },
];

export default function FAQPage() {
  const featuredFAQs = faqs.filter((faq) => faq.isFeatured);
  const regularFAQs = faqs.filter((faq) => !faq.isFeatured);

  return (
    <>
      {/* Hero Section */}
      <Section className="py-24 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <SmoothImage
            src="/portland-fresh-new-5.jpg"
            alt="FAQ"
            fill
            className="object-cover scale-110 animate-ken-burns"
            priority
            quality={90}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/80 via-accent-green/70 to-accent-yellow/60" />
        </div>

        {/* Organic overlays for depth */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-yellow/20 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 z-[1]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-green/20 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 z-[1]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeIn direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
              <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-semibold text-accent-primary">Got Questions?</span>
            </div>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
              Frequently Asked Questions
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <p className="text-xl sm:text-2xl text-white/95 leading-relaxed max-w-3xl mx-auto drop-shadow-md">
              Everything you need to know about our sauces, ordering, and delivery.
            </p>
          </FadeIn>
        </div>
      </Section>

      {/* FAQs Section */}
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Featured FAQs */}
          <div className="mb-16">
            <FadeIn direction="up">
              <h2 className="font-heading text-3xl font-bold mb-8 text-center">
                Popular Questions
              </h2>
            </FadeIn>
            <FAQAccordion faqs={featuredFAQs} />
          </div>

          {/* All FAQs */}
          <div>
            <FadeIn direction="up">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <h2 className="font-heading text-2xl font-bold text-gray-900">
                  More Questions
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>
            </FadeIn>
            <FAQAccordion faqs={regularFAQs} />
          </div>
        </div>
      </Section>

      {/* Contact CTA */}
      <Section className="bg-gradient-to-b from-white to-accent-cream/30">
        <FadeIn direction="up" className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-accent-yellow/10 to-accent-green/10 p-12 rounded-2xl border-2 border-accent-yellow/30">
            <h2 className="font-heading text-3xl font-bold mb-4">
              Still have questions?
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              We're here to help! Reach out and we'll get back to you within 24 hours.
            </p>
            <a
              href="mailto:hello@pdxfreshfoods.com"
              className="inline-block px-8 py-4 bg-accent-primary text-white rounded-full font-semibold text-lg hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Contact Us
            </a>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
