import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/lib/sanity.client';
import { homePageQuery } from '@/lib/sanity.queries';
import { Section } from '@/components/Section';
import { RichText } from '@/components/RichText';
import { BlendCard } from '@/components/BlendCard';
import { urlFor } from '@/lib/image';

export const revalidate = 60;

async function getHomePage() {
  try {
    return await client.fetch(homePageQuery);
  } catch (error) {
    console.error('Error fetching home page:', error);
    return null;
  }
}

export default async function Home() {
  const homePage = await getHomePage();

  if (!homePage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Unable to load home page. Please try again later.</p>
      </div>
    );
  }

  const { hero, valueProps, featuredBlends, sizesPricing, processIntro, processSteps, sourcingIntro, standards, communityBlurb } = homePage;

  return (
    <>
      {/* Hero Section */}
      {hero && (
        <Section className="bg-gradient-to-br from-gray-50 to-white py-20 sm:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              {hero.heading && (
                <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-6 leading-tight">
                  {hero.heading}
                </h1>
              )}
              {hero.subheading && (
                <p className="text-lg text-muted mb-8 leading-relaxed">
                  {hero.subheading}
                </p>
              )}
              <div className="flex gap-4">
                {hero.ctaPrimary && (
                  <Link
                    href={hero.ctaPrimary.target?.pageRef?.slug?.current
                      ? `/${hero.ctaPrimary.target.pageRef.slug.current}`
                      : hero.ctaPrimary.target?.externalUrl || '#'}
                    className="px-6 py-3 bg-accent-red text-white rounded-md font-semibold hover:opacity-90 transition-opacity"
                  >
                    {hero.ctaPrimary.label}
                  </Link>
                )}
                {hero.ctaSecondary && (
                  <Link
                    href={hero.ctaSecondary.target?.pageRef?.slug?.current
                      ? `/${hero.ctaSecondary.target.pageRef.slug.current}`
                      : hero.ctaSecondary.target?.externalUrl || '#'}
                    className="px-6 py-3 border-2 border-black text-black rounded-md font-semibold hover:bg-black hover:text-white transition-colors"
                  >
                    {hero.ctaSecondary.label}
                  </Link>
                )}
              </div>
            </div>
            {hero.image && (
              <div className="relative h-96 md:h-full">
                <Image
                  src={urlFor(hero.image).url()}
                  alt="Hero"
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Value Props */}
      {valueProps && valueProps.length > 0 && (
        <Section>
          <div className="grid md:grid-cols-3 gap-8">
            {valueProps.map((prop: any, idx: number) => (
              <div key={idx} className="text-center">
                {prop.icon && (
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <Image
                      src={urlFor(prop.icon).url()}
                      alt={prop.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <h3 className="font-heading text-xl font-bold mb-2">
                  {prop.title}
                </h3>
                <p className="text-muted">{prop.body}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Featured Blends */}
      {featuredBlends && featuredBlends.length > 0 && (
        <Section className="bg-gray-50">
          <h2 className="font-heading text-4xl font-bold text-center mb-12">
            Our Blends
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredBlends.map((blend: any) => (
              <BlendCard key={blend._id} blend={blend} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/blends"
              className="px-6 py-3 bg-black text-white rounded-md font-semibold hover:opacity-90 transition-opacity inline-block"
            >
              Explore All Blends
            </Link>
          </div>
        </Section>
      )}

      {/* Pricing */}
      {sizesPricing && sizesPricing.length > 0 && (
        <Section>
          <h2 className="font-heading text-4xl font-bold text-center mb-12">
            Sizing & Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {sizesPricing
              .filter((sp: any) => sp.isActive)
              .map((size: any) => (
                <div
                  key={size._id}
                  className="border-2 border-gray-200 rounded-lg p-6 text-center hover:border-accent-red transition-colors"
                >
                  <h3 className="font-heading text-xl font-bold mb-2">
                    {size.label}
                  </h3>
                  <p className="text-3xl font-bold text-accent-red mb-4">
                    ${size.price}
                  </p>
                  {size.sku && (
                    <p className="text-xs text-muted mb-4">SKU: {size.sku}</p>
                  )}
                  <button className="w-full px-4 py-2 bg-black text-white rounded-md font-semibold hover:opacity-90 transition-opacity">
                    Add to Cart
                  </button>
                </div>
              ))}
          </div>
        </Section>
      )}

      {/* Process */}
      {processSteps && processSteps.length > 0 && (
        <Section className="bg-gray-50">
          {processIntro && (
            <p className="text-center text-lg text-muted mb-12">
              {processIntro}
            </p>
          )}
          <div className="space-y-12">
            {processSteps.map((step: any, idx: number) => (
              <div
                key={step._id}
                className={`grid md:grid-cols-2 gap-8 items-center ${
                  idx % 2 === 1 ? 'md:grid-flow-dense' : ''
                }`}
              >
                <div className={idx % 2 === 1 ? 'md:col-start-2' : ''}>
                  <h3 className="font-heading text-2xl font-bold mb-4">
                    {step.title}
                  </h3>
                  {step.body && <RichText value={step.body} />}
                </div>
                {step.image && (
                  <div className="relative h-64">
                    <Image
                      src={urlFor(step.image).url()}
                      alt={step.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Sourcing Standards */}
      {standards && standards.length > 0 && (
        <Section>
          {sourcingIntro && (
            <p className="text-center text-lg text-muted mb-12">
              {sourcingIntro}
            </p>
          )}
          <div className="grid md:grid-cols-2 gap-8">
            {standards.map((standard: any) => (
              <div key={standard._id} className="border-l-4 border-accent-red pl-6">
                <h3 className="font-heading text-xl font-bold mb-3">
                  {standard.title}
                </h3>
                {standard.body && <RichText value={standard.body} />}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Community/Newsletter */}
      {communityBlurb && (
        <Section className="bg-accent-yellow/10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-6">
              Join the Community
            </h2>
            <p className="text-lg text-muted mb-8">{communityBlurb}</p>
            <form className="flex gap-3 mb-8">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-accent-red text-white rounded-md font-semibold hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
            <p className="text-sm text-muted">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </Section>
      )}
    </>
  );
}
