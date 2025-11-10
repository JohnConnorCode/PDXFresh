import { Metadata } from 'next';
import Link from 'next/link';
import { client } from '@/lib/sanity.client';
import { subscriptionsPageQuery } from '@/lib/sanity.queries';
import { Section } from '@/components/Section';

export const revalidate = 60;

async function getSubscriptionsPage() {
  try {
    return await client.fetch(subscriptionsPageQuery);
  } catch (error) {
    console.error('Error fetching subscriptions page:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSubscriptionsPage();

  return {
    title: page?.seo?.metaTitle || 'Subscriptions | Long Life',
    description: page?.seo?.metaDescription || 'Subscribe to weekly or bi-weekly juice drops. Priority access to limited runs and seasonal blends.',
  };
}

export default async function SubscriptionsPage() {
  const page = await getSubscriptionsPage();

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Unable to load page. Please try again later.</p>
      </div>
    );
  }

  const {
    heroHeading,
    heroTagline,
    heroText,
    howHeading,
    howSteps,
    perksHeading,
    perks,
    pricingHeading,
    plans,
    pricingNote,
    ctaHeading,
    ctaText,
  } = page;

  const stepColors = ['bg-accent-yellow', 'bg-accent-primary text-white', 'bg-accent-green'];

  return (
    <>
      {/* Hero */}
      <Section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-6">
            {heroHeading || 'Subscriptions'}
          </h1>
          {heroTagline && (
            <p className="text-xl text-muted mb-8">
              {heroTagline}
            </p>
          )}
          {heroText && (
            <p className="text-lg text-muted leading-relaxed">
              {heroText}
            </p>
          )}
        </div>
      </Section>

      {/* How It Works */}
      {howSteps && howSteps.length > 0 && (
        <Section>
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-8 text-center">
              {howHeading || 'How It Works'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {howSteps.map((step: any, idx: number) => (
                <div key={idx} className="text-center">
                  <div className={`w-16 h-16 ${stepColors[idx % stepColors.length]} rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4`}>
                    {step.stepNumber || idx + 1}
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Member Perks */}
      {perks && perks.length > 0 && (
        <Section className="bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-8 text-center">
              {perksHeading || 'Member Perks'}
            </h2>
            <div className="space-y-4">
              {perks.map((perk: any, idx: number) => (
                <div key={idx} className="flex items-start gap-4 p-6 bg-white rounded-lg">
                  <div className="text-accent-primary text-2xl">✓</div>
                  <div>
                    <h3 className="font-semibold mb-1">{perk.title}</h3>
                    <p className="text-muted">
                      {perk.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Pricing */}
      {plans && plans.length > 0 && (
        <Section>
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-8 text-center">
              {pricingHeading || 'Subscription Plans'}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {plans.map((plan: any, idx: number) => (
                <div
                  key={idx}
                  className={`border-2 ${plan.isPopular ? 'border-accent-primary' : 'border-gray-200'} rounded-lg p-8`}
                >
                  {plan.isPopular && (
                    <div className="inline-block px-3 py-1 bg-accent-primary text-white text-xs font-bold rounded-full mb-2">
                      POPULAR
                    </div>
                  )}
                  <h3 className="font-heading text-2xl font-bold mb-4">{plan.name}</h3>
                  <p className="text-muted mb-6">
                    {plan.description}
                  </p>
                  {plan.priceItems && plan.priceItems.length > 0 && (
                    <div className="space-y-3 mb-6">
                      {plan.priceItems.map((item: any, itemIdx: number) => (
                        <div key={itemIdx} className="flex justify-between">
                          <span>{item.size}</span>
                          <span className="font-bold">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button className={`w-full px-6 py-3 ${plan.isPopular ? 'bg-accent-primary' : 'bg-black'} text-white rounded-full font-semibold hover:opacity-90 transition-opacity`}>
                    {plan.buttonText || 'Start Plan'}
                  </button>
                </div>
              ))}
            </div>
            {pricingNote && (
              <p className="text-center text-muted mt-8">
                {pricingNote}
              </p>
            )}
          </div>
        </Section>
      )}

      {/* CTA */}
      {ctaHeading && (
        <Section className="bg-accent-yellow/10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold mb-4">
              {ctaHeading}
            </h2>
            {ctaText && (
              <p className="text-lg text-muted mb-8">
                {ctaText}
              </p>
            )}
            <div className="flex gap-4 justify-center">
              <Link
                href="/blends"
                className="px-6 py-3 bg-accent-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                View Our Blends
              </Link>
              <Link
                href="#newsletter"
                className="px-6 py-3 border-2 border-black text-black rounded-full font-semibold hover:bg-black hover:text-white transition-colors"
              >
                Get Notified
              </Link>
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
