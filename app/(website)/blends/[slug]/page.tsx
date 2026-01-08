import { Metadata } from 'next';
import { logger } from '@/lib/logger';
import Link from 'next/link';
import { getProductBySlug, getAllProductsForStaticGen, getAllProducts } from '@/lib/supabase/queries/products';
import { Section } from '@/components/Section';
import { RichText } from '@/components/RichText';
import { FadeIn, StaggerContainer, FloatingElement } from '@/components/animations';
import { VariantSelector } from '@/components/blends/VariantSelector';
import { BlendCard } from '@/components/BlendCard';
import { SmoothImage } from '@/components/SmoothImage';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

interface BlendPageProps {
  params: {
    slug: string;
  };
}

async function getBlend(slug: string) {
  try {
    return await getProductBySlug(slug);
  } catch (error) {
    logger.error('Error fetching blend:', error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const blends = await getAllProductsForStaticGen();
    return blends.map((blend: any) => ({
      slug: blend.slug,
    }));
  } catch (error) {
    logger.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: BlendPageProps): Promise<Metadata> {
  const blend = await getBlend(params.slug);

  if (!blend) {
    return {
      title: 'Sauce Not Found',
      description: 'This sauce could not be found.',
    };
  }

  return {
    title: blend.meta_title || `${blend.name} | Portland Fresh`,
    description: blend.meta_description || blend.tagline || undefined,
    openGraph: {
      title: blend.meta_title || blend.name,
      description: blend.meta_description || blend.tagline || undefined,
      images: blend.image_url ? [{ url: blend.image_url }] : [],
    },
  };
}

export default async function BlendPage({ params }: BlendPageProps) {
  const blend = await getBlend(params.slug);
  const allBlends = await getAllProducts();

  // Get other sauces (exclude current one)
  const otherBlends = allBlends.filter((b: any) => b.slug !== params.slug).slice(0, 3);

  if (!blend) {
    return (
      <Section>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Sauce Not Found</h1>
          <Link href="/blends" className="text-accent-primary hover:underline">
            Back to Sauces
          </Link>
        </div>
      </Section>
    );
  }

  const labelColorMap: Record<string, string> = {
    yellow: 'from-accent-yellow/80 to-accent-yellow',
    red: 'from-accent-primary/80 to-accent-primary',
    green: 'from-accent-green/80 to-accent-green',
    blue: 'from-blue-500/80 to-blue-600',
  };

  const gradientClass = blend.label_color ? labelColorMap[blend.label_color] || 'from-accent-primary/80 to-accent-primary' : 'from-accent-primary/80 to-accent-primary';
  const readableCategory = blend.category ? blend.category.replace(/-/g, ' ') : null;
  const containsNuts = Boolean(blend.contains_nuts);

  return (
    <>
      {/* Hero Section - Compact & Focused */}
      <Section className={`bg-gradient-to-br from-accent-cream via-accent-yellow/10 to-accent-green/10 py-12 sm:py-16 relative overflow-hidden`}>
        {/* Organic background shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-yellow/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-green/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10 grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {blend.image_url && (
            <FadeIn direction="left">
              <div className="sticky top-24">
                <FloatingElement yOffset={15} duration={6}>
                  <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                    <SmoothImage
                      src={blend.image_url}
                      alt={blend.image_alt || blend.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} opacity-0 hover:opacity-20 transition-opacity duration-300`} />
                  </div>
                </FloatingElement>
              </div>
            </FadeIn>
          )}
          <div className="space-y-6">
            <FadeIn direction="right" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${gradientClass}`} />
                <span className="text-sm font-semibold text-gray-700">Fresh Weekly Batch</span>
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={0.2}>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                {blend.name}
              </h1>
            </FadeIn>
            <FadeIn direction="right" delay={0.3}>
              {blend.tagline && (
                <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed">{blend.tagline}</p>
              )}
            </FadeIn>
            {(blend.weight || blend.heat_level || readableCategory || containsNuts) && (
              <FadeIn direction="right" delay={0.35}>
                <div className="flex flex-wrap gap-3 text-sm font-semibold text-gray-600">
                  {blend.weight && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-gray-200">
                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
                      </svg>
                      {blend.weight}
                    </span>
                  )}
                  {blend.heat_level && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-gray-200">
                      <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3c2.755 2.755 4 5.51 4 8.265C16 15.02 13.314 18 12 21c-1.314-3-4-5.98-4-9.735C8 8.51 9.245 5.755 12 3z" />
                      </svg>
                      {blend.heat_level} heat
                    </span>
                  )}
                  {readableCategory && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-gray-200 capitalize">
                      <svg className="w-3.5 h-3.5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      {readableCategory}
                    </span>
                  )}
                  {containsNuts && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-gray-200 text-accent-primary">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3c-3.866 0-7 2.42-7 5.405C5 13.19 12 21 12 21s7-7.81 7-12.595C19 5.42 15.866 3 12 3z" />
                      </svg>
                      Contains nuts
                    </span>
                  )}
                </div>
              </FadeIn>
            )}
            {blend.best_for && blend.best_for.length > 0 && (
              <FadeIn direction="right" delay={0.4}>
                <div className="flex flex-wrap gap-2">
                  {blend.best_for.map((idea: string) => (
                    <span key={idea} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold uppercase tracking-wide">
                      {idea}
                    </span>
                  ))}
                </div>
              </FadeIn>
            )}
            {/* Description - Moved up here for better flow */}
            {blend.description && (
              <FadeIn direction="right" delay={0.5}>
                <div className="prose prose-base prose-headings:font-heading prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed max-w-none bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                  <RichText value={blend.description} />
                </div>
              </FadeIn>
            )}

            {/* Quick Pricing Preview */}
            {blend.variants && blend.variants.length > 0 && (
              <FadeIn direction="right" delay={0.6}>
                <div className="bg-white rounded-xl p-6 shadow-md border-2 border-accent-green/20">
                  <h3 className="font-heading text-lg font-bold mb-3 text-gray-900">Available Sizes</h3>
                  <div className="space-y-2 mb-4">
                    {blend.variants
                      .filter((v: any) => v.is_active && (!v.billing_type || v.billing_type === 'one_time'))
                      .slice(0, 3)
                      .map((variant: any) => (
                        <div key={variant.id} className="flex justify-between items-center text-sm">
                          <span className="font-medium text-gray-700">{variant.label}</span>
                          {variant.price_usd && (
                            <span className="font-bold text-accent-primary">${variant.price_usd}</span>
                          )}
                        </div>
                      ))}
                  </div>
                  <Link
                    href="#pricing"
                    className="block w-full text-center px-6 py-3 bg-accent-primary text-white rounded-full font-semibold hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Order This Batch
                  </Link>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </Section>

      {/* Serving Rituals */}
      {blend.function_list && blend.function_list.length > 0 && (
        <Section className="bg-gradient-to-b from-accent-cream/40 via-white to-accent-cream/20 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto">
            <FadeIn direction="up" className="text-center mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-2">How We Serve It</p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Kitchen rituals for this batch</h2>
              <p className="text-base text-gray-600">
                Straight from the Portland Fresh fridge to your table. Spoon, drizzle, toss—no cooking required.
              </p>
            </FadeIn>
            <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-3 gap-6">
              {blend.function_list.map((idea: string) => (
                <FadeIn key={idea} direction="up" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ritual
                  </div>
                  <h3 className="font-heading text-xl text-gray-900">{idea}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {blend.name} was built for this moment—use a spoonful to {idea.toLowerCase()} and let the aromatics do the work.
                  </p>
                </FadeIn>
              ))}
            </StaggerContainer>
          </div>
        </Section>
      )}

      {/* Chef Notes */}
      {blend.story && (
        <Section className="bg-white py-12 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <FadeIn direction="up">
              <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-md">
                <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-3">Chef notes</p>
                <h2 className="font-heading text-3xl font-bold text-gray-900 mb-6">{blend.name} in the kitchen</h2>
                <div className="prose prose-lg max-w-none">
                  <RichText value={blend.story} />
                </div>
              </div>
            </FadeIn>
          </div>
        </Section>
      )}

      {/* Kitchen Logistics */}
      <Section className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <FadeIn direction="up" className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50 mb-2">How to get it</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3">Portland-first distribution</h2>
            <p className="text-base text-white/70">
              Pick up from our Buckman kitchen, find us at New Seasons + farmers markets, or schedule limited bike delivery inside the city core.
            </p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Buckman pickups',
                body: 'Thursday evening + Sunday morning windows. Bring your cooler bag or grab one of ours.',
              },
              {
                title: 'Market partners',
                body: 'Shop select New Seasons locations or our weekly farmers market booths for grab-and-go containers.',
              },
              {
                title: 'Local delivery',
                body: 'Bike and EV drops Tuesday + Friday inside SE, NE, and inner SW Portland for qualifying orders.',
              },
            ].map((item) => (
              <FadeIn key={item.title} direction="up" className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
                <h3 className="font-heading text-xl font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-sm text-white/70">{item.body}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* Ingredients - Compact Visual Design */}
      {blend.ingredients && blend.ingredients.length > 0 && (
        <Section className="bg-white py-12 sm:py-16">
          <div className="relative z-10">
            <FadeIn direction="up" className="text-center mb-8">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-2 leading-tight">
                Sourced Ingredients
              </h2>
              <p className="text-lg text-gray-600">Sourced from trusted regenerative farms</p>
            </FadeIn>

            {/* Compact Grid Layout */}
            <div className="max-w-5xl mx-auto">
              <StaggerContainer staggerDelay={0.05} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {blend.ingredients?.filter((item: any) => item && item.ingredient && item.ingredient.name).map((item: any) => {
                  const ingredient = item.ingredient;
                  const typeColors: Record<string, string> = {
                    fruit: 'from-accent-primary/20 to-accent-primary/10',
                    root: 'from-accent-yellow/20 to-accent-yellow/10',
                    green: 'from-accent-green/20 to-accent-green/10',
                    herb: 'from-accent-green/20 to-accent-yellow/10',
                  };
                  const bgColor = ingredient.type ? typeColors[ingredient.type] || 'from-gray-100 to-gray-50' : 'from-gray-100 to-gray-50';

                  return (
                    <div
                      key={item.id}
                      className="group relative bg-gradient-to-br p-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-accent-green/30"
                      style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                    >
                      <div className={`bg-gradient-to-br ${bgColor} rounded-xl p-4`}>
                        {/* Icon */}
                        <div className="w-12 h-12 bg-white rounded-full mb-3 flex items-center justify-center shadow-sm">
                          <span className="text-xl font-heading font-bold text-accent-primary">
                            {ingredient.name?.charAt(0) || '?'}
                          </span>
                        </div>

                        {/* Name */}
                        <h3 className="font-heading text-base font-bold mb-1 text-gray-900">
                          {ingredient.name}
                        </h3>

                        {/* Type */}
                        {ingredient.type && (
                          <p className="text-xs font-medium text-gray-600 capitalize mb-2">
                            {ingredient.type}
                          </p>
                        )}

                        {/* Seasonality */}
                        {ingredient.seasonality && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span>{ingredient.seasonality}</span>
                          </div>
                        )}
                      </div>

                      {/* Farm info on hover - tooltip style */}
                      {ingredient.farms && ingredient.farms.length > 0 && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl max-w-xs whitespace-nowrap">
                            <p className="font-semibold mb-1">Farm: {ingredient.farms[0].name}</p>
                            {ingredient.farms[0].location && (
                              <p className="text-gray-300">{ingredient.farms[0].location}</p>
                            )}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </StaggerContainer>
            </div>
          </div>
        </Section>
      )}

      {/* Pricing */}
      {blend.variants && blend.variants.length > 0 && (
        <Section id="pricing" className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16">
          <div className="relative z-10">
            <FadeIn direction="up" className="text-center mb-8">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-2 leading-tight">
                Choose your size
              </h2>
              <p className="text-lg text-gray-600">Batch-blended each week and packed for pickup or local delivery windows</p>
            </FadeIn>
            <VariantSelector
              variants={blend.variants}
              productName={blend.name}
              productImage={blend.image_url || undefined}
              blendSlug={params.slug}
            />
          </div>
        </Section>
      )}

      {/* Related Sauces - Other Products */}
      {otherBlends && otherBlends.length > 0 && (
        <Section className="bg-white py-12 sm:py-16 border-t border-gray-100">
          <FadeIn direction="up">
            <div className="text-center mb-8">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-2 leading-tight">
                Explore More Sauces
              </h2>
              <p className="text-lg text-gray-600">Discover more small-batch flavor combinations</p>
            </div>
          </FadeIn>
          <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {otherBlends.map((otherBlend: any) => (
              <BlendCard key={otherBlend.id} blend={otherBlend} />
            ))}
          </StaggerContainer>
          <FadeIn direction="up" delay={0.3}>
            <div className="text-center mt-8">
              <Link
                href="/blends"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary text-white rounded-full font-semibold hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span>View All Sauces</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </FadeIn>
        </Section>
      )}
    </>
  );
}
