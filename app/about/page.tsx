import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/lib/sanity.client';
import { aboutPageQuery } from '@/lib/sanity.queries';
import { Section } from '@/components/Section';
import { RichText } from '@/components/RichText';
import { urlFor } from '@/lib/image';

export const revalidate = 60;

async function getAboutPage() {
  try {
    return await client.fetch(aboutPageQuery);
  } catch (error) {
    console.error('Error fetching about page:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const aboutPage = await getAboutPage();

  return {
    title: aboutPage?.seo?.metaTitle || 'About | Long Life',
    description: aboutPage?.seo?.metaDescription || 'Return to nature in a world of machines. Learn about our mission to bring people back to real nourishment and clear minds.',
  };
}

export default async function AboutPage() {
  const aboutPage = await getAboutPage();

  if (!aboutPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Unable to load about page. Please try again later.</p>
      </div>
    );
  }

  const {
    heroHeading,
    heroSubheading,
    introText,
    whyHeading,
    whyContent,
    howHeading,
    howContent,
    promiseHeading,
    promises,
    visionHeading,
    visionContent,
    teamHeading,
    teamMembers,
    valuesHeading,
    values,
    ctaHeading,
    ctaText,
    disclaimer,
  } = aboutPage;
  return (
    <>
      {/* Hero */}
      <Section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-8 leading-tight">
            {heroHeading || 'Return to nature in a world of machines.'}
          </h1>
          <p className="text-xl text-muted leading-relaxed">
            {heroSubheading || 'Modern life is efficient but empty. Long Life exists to bring people back to real nourishment and clear minds.'}
          </p>
        </div>
      </Section>

      {/* Story */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg max-w-none">
            {introText && (
              <p className="text-lg text-muted leading-relaxed mb-6">
                {introText}
              </p>
            )}

            {whyHeading && (
              <h2 className="font-heading text-3xl font-bold mb-6 mt-12">
                {whyHeading}
              </h2>
            )}

            {whyContent && (
              <div className="mb-6">
                <RichText value={whyContent} />
              </div>
            )}

            {howHeading && (
              <h2 className="font-heading text-3xl font-bold mb-6 mt-12">
                {howHeading}
              </h2>
            )}

            {howContent && (
              <div className="mb-6">
                <RichText value={howContent} />
              </div>
            )}

            {promiseHeading && (
              <h2 className="font-heading text-3xl font-bold mb-6 mt-12">
                {promiseHeading}
              </h2>
            )}

            {promises && promises.length > 0 && (
              <div className="bg-gray-50 p-8 rounded-lg my-8">
                <ul className="space-y-4 text-lg">
                  {promises.map((promise: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-accent-primary text-2xl">✓</span>
                      <span>
                        <strong>{promise.title}</strong> {promise.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Vision */}
      {(visionHeading || visionContent) && (
        <Section className="bg-gray-50">
          <div className="max-w-3xl mx-auto text-center">
            {visionHeading && (
              <h2 className="font-heading text-3xl font-bold mb-6">
                {visionHeading}
              </h2>
            )}
            {visionContent && (
              <div className="prose prose-lg max-w-none">
                <RichText value={visionContent} />
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Team */}
      {teamMembers && teamMembers.length > 0 && (
        <Section>
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-12 text-center">
              {teamHeading || 'The team'}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {teamMembers.map((member: any) => (
                <div key={member._id} className="text-center">
                  {member.image ? (
                    <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                      <Image
                        src={urlFor(member.image).url()}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-muted">
                      [Photo]
                    </div>
                  )}
                  <h3 className="font-heading text-xl font-bold mb-2">{member.name}</h3>
                  {member.role && (
                    <p className="text-sm text-muted mb-4">{member.role}</p>
                  )}
                  {member.bio && (
                    <p className="text-sm text-muted leading-relaxed">{member.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Values */}
      {values && values.length > 0 && (
        <Section className="bg-accent-yellow/10">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-12 text-center">
              {valuesHeading || 'What we stand for'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value: any, idx: number) => (
                <div key={idx} className="text-center">
                  {value.emoji && (
                    <div className="text-4xl mb-4">{value.emoji}</div>
                  )}
                  <h3 className="font-heading text-lg font-bold mb-3">{value.title}</h3>
                  <p className="text-sm text-muted">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* CTA */}
      {(ctaHeading || ctaText) && (
        <Section>
          <div className="max-w-2xl mx-auto text-center">
            {ctaHeading && (
              <h2 className="font-heading text-3xl font-bold mb-6">
                {ctaHeading}
              </h2>
            )}
            {ctaText && (
              <p className="text-lg text-muted leading-relaxed mb-8">
                {ctaText}
              </p>
            )}
            <div className="flex gap-4 justify-center">
              <Link
                href="/blends"
                className="px-6 py-3 bg-accent-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Shop Weekly Batches
              </Link>
              <Link
                href="/#newsletter"
                className="px-6 py-3 border-2 border-black text-black rounded-full font-semibold hover:bg-black hover:text-white transition-colors"
              >
                Join the List
              </Link>
            </div>
          </div>
        </Section>
      )}

      {/* Responsible Language */}
      {disclaimer && (
        <Section className="bg-gray-50">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm text-muted leading-relaxed">
              {disclaimer}
            </p>
          </div>
        </Section>
      )}
    </>
  );
}
