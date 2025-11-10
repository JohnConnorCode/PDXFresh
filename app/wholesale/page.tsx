import { Metadata } from 'next';
import { client } from '@/lib/sanity.client';
import { wholesalePageQuery } from '@/lib/sanity.queries';
import { Section } from '@/components/Section';

export const revalidate = 60;

async function getWholesalePage() {
  try {
    return await client.fetch(wholesalePageQuery);
  } catch (error) {
    console.error('Error fetching wholesale page:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getWholesalePage();

  return {
    title: page?.seo?.metaTitle || 'Wholesale & Teams | Long Life',
    description: page?.seo?.metaDescription || 'Partner with Long Life for wholesale juice programs. Retail bottles, bulk jugs, team wellness fridges, and event bars.',
  };
}

export default async function WholesalePage() {
  const page = await getWholesalePage();

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
    partnersHeading,
    partnerTypes,
    programsHeading,
    programs,
    whyHeading,
    benefits,
    ctaHeading,
    ctaText,
    ctaNote,
  } = page;

  return (
    <>
      {/* Hero */}
      <Section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-6">
            {heroHeading || 'Wholesale & Teams'}
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

      {/* Who We Work With */}
      {partnerTypes && partnerTypes.length > 0 && (
        <Section>
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-12 text-center">
              {partnersHeading || 'Who We Work With'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {partnerTypes.map((partner: any, idx: number) => (
                <div key={idx} className="text-center p-6">
                  {partner.emoji && (
                    <div className="text-4xl mb-4">{partner.emoji}</div>
                  )}
                  <h3 className="font-heading text-xl font-bold mb-3">
                    {partner.title}
                  </h3>
                  <p className="text-muted">
                    {partner.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Programs */}
      {programs && programs.length > 0 && (
        <Section className="bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-12 text-center">
              {programsHeading || 'Wholesale Programs'}
            </h2>

            <div className="space-y-6">
              {programs.map((program: any, idx: number) => (
                <div key={idx} className="bg-white p-8 rounded-lg">
                  <h3 className="font-heading text-2xl font-bold mb-4">
                    {program.title}
                  </h3>
                  {program.description && (
                    <p className="text-muted mb-6">
                      {program.description}
                    </p>
                  )}
                  {program.options && program.options.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      {program.options.map((option: any, optionIdx: number) => (
                        <div key={optionIdx} className="border border-gray-200 rounded p-4">
                          <p className="font-semibold mb-1">{option.name}</p>
                          <p className="text-sm text-muted">{option.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {program.note && (
                    <div className={`border-l-4 ${program.noteColor || 'border-accent-green'} pl-4`}>
                      <p className="text-sm font-semibold mb-1">
                        {program.note.split('\n')[0]}
                      </p>
                      {program.note.split('\n').slice(1).map((line: string, lineIdx: number) => (
                        <p key={lineIdx} className="text-sm text-muted">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Why Partner With Us */}
      {benefits && benefits.length > 0 && (
        <Section>
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-8 text-center">
              {whyHeading || 'Why Partner With Long Life'}
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit: any, idx: number) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="text-accent-primary text-2xl">✓</div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-muted">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Application CTA */}
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
            <form className="space-y-4 mb-8">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Business Name"
                  className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                  required
                />
                <input
                  type="text"
                  placeholder="Contact Name"
                  className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                  required
                />
              </div>
              <select
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                required
              >
                <option value="">Select Program Type</option>
                <option value="retail">Retail Bottles & Shots</option>
                <option value="bulk">Refillable Bulk Jugs</option>
                <option value="wellness">Team Wellness Fridge</option>
                <option value="events">Event Bars & Pop-Ups</option>
              </select>
              <textarea
                placeholder="Tell us about your business and how you'd serve Long Life..."
                rows={4}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-accent-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Apply for Wholesale
              </button>
            </form>
            {ctaNote && (
              <p className="text-sm text-muted">
                {ctaNote}
              </p>
            )}
          </div>
        </Section>
      )}
    </>
  );
}
