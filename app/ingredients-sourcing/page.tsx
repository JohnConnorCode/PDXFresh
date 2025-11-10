import { Metadata } from 'next';
import Link from 'next/link';
import { client } from '@/lib/sanity.client';
import { ingredientsSourcingPageQuery } from '@/lib/sanity.queries';
import { Section } from '@/components/Section';
import { RichText } from '@/components/RichText';

export const revalidate = 60;

async function getIngredientsSourcingPage() {
  try {
    return await client.fetch(ingredientsSourcingPageQuery);
  } catch (error) {
    console.error('Error fetching ingredients & sourcing page:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getIngredientsSourcingPage();

  return {
    title: page?.seo?.metaTitle || 'Ingredients & Sourcing | Long Life',
    description: page?.seo?.metaDescription || 'Transparent sourcing from trusted growers. Organic-first, seasonal rotation, batch-dated quality.',
  };
}

export default async function IngredientsSourcingPage() {
  const page = await getIngredientsSourcingPage();

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Unable to load page. Please try again later.</p>
      </div>
    );
  }

  const {
    heroHeading,
    heroSubheading,
    philosophyHeading,
    philosophyIntro,
    philosophyContent,
    standardsHeading,
    standards,
    spotlightHeading,
    ingredientCategories,
    spotlightNote,
    farmHeading,
    farmText,
    farmFormNote,
    transparencyHeading,
    transparencyText,
  } = page;

  const borderColors = ['border-accent-yellow', 'border-accent-primary', 'border-accent-green', 'border-black'];

  return (
    <>
      {/* Hero */}
      <Section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-6">
            {heroHeading || 'Ingredients & Sourcing'}
          </h1>
          <p className="text-xl text-muted leading-relaxed">
            {heroSubheading || 'We source from trusted growers who share our standards. Seasonal rotation is part of the craft.'}
          </p>
        </div>
      </Section>

      {/* Philosophy */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl font-bold mb-6 text-center">
            {philosophyHeading || 'Our Sourcing Philosophy'}
          </h2>
          {philosophyIntro && (
            <p className="text-lg text-muted leading-relaxed mb-8 text-center">
              {philosophyIntro}
            </p>
          )}
          {philosophyContent && (
            <div className="prose prose-lg max-w-none text-muted">
              <RichText value={philosophyContent} />
            </div>
          )}
        </div>
      </Section>

      {/* Our Standards */}
      {standards && standards.length > 0 && (
        <Section className="bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-12 text-center">
              {standardsHeading || 'Our Standards'}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {standards.map((standard: any, idx: number) => (
                <div
                  key={standard._id}
                  className={`bg-white p-8 rounded-lg border-l-4 ${borderColors[idx % borderColors.length]}`}
                >
                  <h3 className="font-heading text-xl font-bold mb-4">
                    {standard.title}
                  </h3>
                  {standard.body && (
                    <div className="text-muted leading-relaxed">
                      <RichText value={standard.body} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Ingredient Spotlight */}
      {ingredientCategories && ingredientCategories.length > 0 && (
        <Section>
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-12 text-center">
              {spotlightHeading || 'What Goes Into Our Blends'}
            </h2>

            <div className="space-y-12">
              {ingredientCategories.map((category: any, idx: number) => (
                <div key={idx}>
                  <h3 className={`font-heading text-2xl font-bold mb-6 ${category.color || 'text-accent-yellow'}`}>
                    {category.categoryName}
                  </h3>
                  {category.ingredients && category.ingredients.length > 0 && (
                    <div className="grid md:grid-cols-3 gap-6">
                      {category.ingredients.map((ingredient: string, ingredientIdx: number) => (
                        <div
                          key={ingredientIdx}
                          className={`border border-gray-200 rounded-lg p-4 text-center hover:${category.hoverColor || 'border-accent-yellow'} transition-colors`}
                        >
                          <p className="font-semibold">{ingredient}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {spotlightNote && (
              <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
                <p className="text-muted">
                  <strong>That's it.</strong> {spotlightNote}
                </p>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Farm Partners */}
      {farmHeading && (
        <Section className="bg-accent-yellow/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold mb-6">
              {farmHeading}
            </h2>
            {farmText && (
              <p className="text-lg text-muted leading-relaxed mb-8">
                {farmText}
              </p>
            )}
            <form className="space-y-4 mb-8">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Farm Name"
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
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                required
              />
              <input
                type="text"
                placeholder="What do you grow?"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                required
              />
              <textarea
                placeholder="Tell us about your farm, practices, and growing season..."
                rows={4}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-accent-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Introduce Your Farm
              </button>
            </form>
            {farmFormNote && (
              <p className="text-sm text-muted">
                {farmFormNote}
              </p>
            )}
          </div>
        </Section>
      )}

      {/* Transparency Note */}
      {transparencyHeading && (
        <Section>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-2xl font-bold mb-4">
              {transparencyHeading}
            </h2>
            {transparencyText && (
              <p className="text-muted leading-relaxed">
                {transparencyText}
              </p>
            )}
            <div className="mt-8">
              <Link
                href="mailto:hello@longlife.com"
                className="px-6 py-3 bg-black text-white rounded-full font-semibold hover:opacity-90 transition-opacity inline-block"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
