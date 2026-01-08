import { Metadata } from 'next';
import { Section } from '@/components/Section';
import { FadeIn, StaggerContainer } from '@/components/animations';
import { ContactForm } from '@/components/ContactForm';
import { SmoothImage } from '@/components/SmoothImage';

export const metadata: Metadata = {
  title: 'Contact Us | Portland Fresh',
  description: 'Get in touch with Portland Fresh. We\'re here to answer your questions about sauces, pestos, salsa subscriptions, wholesale, and more.',
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <Section className="py-24 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Desktop Image */}
          <div className="hidden md:block absolute inset-0">
            <SmoothImage
              src="/portland-fresh-new-7.jpg"
              alt="Contact Us"
              fill
              className="object-cover scale-110 animate-ken-burns"
              priority
              quality={90}
              sizes="100vw"
            />
          </div>
          {/* Mobile Image */}
          <div className="md:hidden absolute inset-0">
            <SmoothImage
              src="/portland-fresh-new-8.jpg"
              alt="Contact Us"
              fill
              className="object-cover scale-110 animate-ken-burns"
              priority
              quality={90}
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-accent-primary/50 to-accent-green/40" />
        </div>

        {/* Organic overlays for depth */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-yellow/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 z-[1]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-green/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 z-[1]" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeIn direction="up" delay={0.2}>
            <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-6 text-white leading-tight">
              Get in Touch
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.4}>
            <p className="text-xl text-white/90 leading-relaxed">
              Questions about our sauces, subscriptions, or wholesale trays? We're here to help.
            </p>
          </FadeIn>
        </div>
      </Section>

      {/* Contact Info Cards */}
      <Section className="bg-white">
        <div className="max-w-6xl mx-auto">
          <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Email */}
            <FadeIn direction="up">
              <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-100 hover:border-accent-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent-primary/20 to-accent-primary/10 mb-4">
                  <svg className="w-8 h-8 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-gray-900">Email Us</h3>
                <a
                  href="mailto:hello@pdxfreshfoods.com"
                  className="text-accent-primary hover:underline text-lg"
                >
                  hello@pdxfreshfoods.com
                </a>
              </div>
            </FadeIn>

            {/* Pickup */}
            <FadeIn direction="up" delay={0.1}>
              <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-100 hover:border-accent-green/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent-green/20 to-accent-green/10 mb-4">
                  <svg className="w-8 h-8 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-gray-900">Kitchen Pickup</h3>
                <p className="text-accent-green text-lg">
                  Buckman, Portland
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Thursdays 4–7pm
                </p>
              </div>
            </FadeIn>

            {/* Social */}
            <FadeIn direction="up" delay={0.2}>
              <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-100 hover:border-accent-yellow/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent-yellow/20 to-accent-yellow/10 mb-4">
                  <svg className="w-8 h-8 text-accent-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-gray-900">Follow Us</h3>
                <div className="flex justify-center gap-4">
                  <a href="https://www.instagram.com/portland.fresh/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-accent-yellow transition-colors">
                    <span className="sr-only">Instagram</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </FadeIn>
          </StaggerContainer>

          {/* Contact Form */}
          <FadeIn direction="up">
            <ContactForm />
          </FadeIn>
        </div>
      </Section>

      {/* Quick Links */}
      <Section className="bg-gradient-to-b from-accent-cream/30 to-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn direction="up">
            <h2 className="font-heading text-3xl font-bold mb-8 text-center text-gray-900">
              Looking for Something Specific?
            </h2>
          </FadeIn>
          <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 gap-6">
            <FadeIn direction="up">
              <a
                href="/wholesale"
                className="group block bg-white p-6 rounded-xl border-2 border-gray-100 hover:border-accent-primary transition-all duration-300 hover:shadow-lg"
              >
                <h3 className="font-heading text-xl font-bold mb-2 text-gray-900 group-hover:text-accent-primary transition-colors">
                  Wholesale Partnerships
                </h3>
                <p className="text-gray-600">
                  Interested in carrying Portland Fresh at your café, studio, or store?
                </p>
              </a>
            </FadeIn>
            <FadeIn direction="up" delay={0.1}>
              <a
                href="/subscriptions"
                className="group block bg-white p-6 rounded-xl border-2 border-gray-100 hover:border-accent-green transition-all duration-300 hover:shadow-lg"
              >
                <h3 className="font-heading text-xl font-bold mb-2 text-gray-900 group-hover:text-accent-green transition-colors">
                  Subscription Plans
                </h3>
                <p className="text-gray-600">
                  Learn about our weekly delivery options and subscription benefits.
                </p>
              </a>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <a
                href="/faq"
                className="group block bg-white p-6 rounded-xl border-2 border-gray-100 hover:border-accent-yellow transition-all duration-300 hover:shadow-lg"
              >
                <h3 className="font-heading text-xl font-bold mb-2 text-gray-900 group-hover:text-accent-yellow transition-colors">
                  FAQs
                </h3>
                <p className="text-gray-600">
                  Find answers to common questions about our products and process.
                </p>
              </a>
            </FadeIn>
            <FadeIn direction="up" delay={0.3}>
              <a
                href="/how-we-make-it"
                className="group block bg-white p-6 rounded-xl border-2 border-gray-100 hover:border-accent-primary transition-all duration-300 hover:shadow-lg"
              >
                <h3 className="font-heading text-xl font-bold mb-2 text-gray-900 group-hover:text-accent-primary transition-colors">
                  Our Process
                </h3>
                <p className="text-gray-600">
                  Discover how we make our sauces and pestos fresh every week.
                </p>
              </a>
            </FadeIn>
          </StaggerContainer>
        </div>
      </Section>
    </>
  );
}
