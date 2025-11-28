import { Section } from '@/components/Section';
import { FadeIn } from '@/components/animations';
import { Check } from 'lucide-react';
import Link from 'next/link';

interface PricingPlan {
  name: string;
  description?: string;
  price: string;
  priceNote?: string;
  features: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  isPopular?: boolean;
  popularLabel?: string;
}

interface PricingSectionProps {
  heading?: string;
  subheading?: string;
  plans: PricingPlan[];
  variant?: 'cards' | 'table';
  backgroundColor?: string;
}

const bgColorMap: Record<string, string> = {
  white: 'bg-white',
  'accent-cream': 'bg-accent-cream',
  'gray-50': 'bg-gray-50',
};

export function PricingSectionComponent({
  heading,
  subheading,
  plans,
  variant = 'cards',
  backgroundColor = 'white',
}: PricingSectionProps) {
  const bgClass = bgColorMap[backgroundColor] || 'bg-white';

  return (
    <Section className={bgClass}>
      {(heading || subheading) && (
        <FadeIn direction="up" className="text-center mb-12">
          {heading && (
            <h2 className="font-heading text-4xl font-bold mb-4">{heading}</h2>
          )}
          {subheading && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subheading}</p>
          )}
        </FadeIn>
      )}

      {variant === 'cards' && (
        <div
          className={`grid gap-8 ${
            plans.length === 1
              ? 'max-w-md mx-auto'
              : plans.length === 2
                ? 'md:grid-cols-2 max-w-3xl mx-auto'
                : plans.length === 3
                  ? 'md:grid-cols-3'
                  : 'md:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {plans.map((plan, index) => (
            <FadeIn key={index} direction="up" delay={index * 0.1}>
              <div
                className={`relative rounded-2xl p-8 ${
                  plan.isPopular
                    ? 'bg-accent-primary text-white shadow-xl scale-105'
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-yellow text-accent-primary text-sm font-semibold rounded-full">
                    {plan.popularLabel || 'Most Popular'}
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      plan.isPopular ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {plan.name}
                  </h3>
                  {plan.description && (
                    <p
                      className={`text-sm ${
                        plan.isPopular ? 'text-white/80' : 'text-gray-600'
                      }`}
                    >
                      {plan.description}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <span
                    className={`text-4xl font-bold ${
                      plan.isPopular ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.priceNote && (
                    <span
                      className={`text-sm ml-2 ${
                        plan.isPopular ? 'text-white/80' : 'text-gray-500'
                      }`}
                    >
                      {plan.priceNote}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          plan.isPopular ? 'text-accent-yellow' : 'text-accent-green'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.isPopular ? 'text-white/90' : 'text-gray-600'
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.ctaUrl && (
                  <Link
                    href={plan.ctaUrl}
                    className={`block w-full text-center py-3 px-6 rounded-full font-semibold transition-all ${
                      plan.isPopular
                        ? 'bg-white text-accent-primary hover:bg-gray-100'
                        : 'bg-accent-primary text-white hover:opacity-90'
                    }`}
                  >
                    {plan.ctaLabel || 'Get Started'}
                  </Link>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      )}

      {variant === 'table' && (
        <FadeIn direction="up" className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-4"></th>
                {plans.map((plan, index) => (
                  <th
                    key={index}
                    className={`text-center p-4 ${
                      plan.isPopular ? 'bg-accent-primary/10' : ''
                    }`}
                  >
                    <div className="font-bold text-lg">{plan.name}</div>
                    <div className="text-2xl font-bold mt-2">{plan.price}</div>
                    {plan.priceNote && (
                      <div className="text-sm text-gray-500">{plan.priceNote}</div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Features listed as rows */}
              {plans[0]?.features.map((_, featureIndex) => (
                <tr key={featureIndex} className="border-t">
                  <td className="p-4 font-medium">
                    {plans[0].features[featureIndex]}
                  </td>
                  {plans.map((plan, planIndex) => (
                    <td
                      key={planIndex}
                      className={`text-center p-4 ${
                        plan.isPopular ? 'bg-accent-primary/10' : ''
                      }`}
                    >
                      <Check className="w-5 h-5 text-accent-green mx-auto" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t">
                <td className="p-4"></td>
                {plans.map((plan, index) => (
                  <td
                    key={index}
                    className={`text-center p-4 ${
                      plan.isPopular ? 'bg-accent-primary/10' : ''
                    }`}
                  >
                    {plan.ctaUrl && (
                      <Link
                        href={plan.ctaUrl}
                        className="inline-block px-6 py-2 bg-accent-primary text-white rounded-full font-semibold hover:opacity-90 transition-all"
                      >
                        {plan.ctaLabel || 'Get Started'}
                      </Link>
                    )}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </FadeIn>
      )}
    </Section>
  );
}
