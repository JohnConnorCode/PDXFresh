import { Section } from '@/components/Section';
import { FadeIn, StaggerContainer } from '@/components/animations';

interface StatsSectionProps {
  heading?: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
  backgroundColor: string;
}

const bgColorMap: Record<string, string> = {
  'accent-primary': 'bg-accent-primary text-white',
  white: 'bg-white text-black',
  'accent-cream': 'bg-accent-cream text-black',
};

export function StatsSectionComponent({
  heading,
  stats,
  backgroundColor,
}: StatsSectionProps) {
  const bgClass = bgColorMap[backgroundColor] || 'bg-accent-primary text-white';

  return (
    <Section className={bgClass}>
      {heading && (
        <FadeIn direction="up">
          <h2 className="font-heading text-4xl font-bold mb-12 text-center">{heading}</h2>
        </FadeIn>
      )}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-5xl md:text-6xl font-bold mb-2">{stat.value}</div>
            <div className="text-lg opacity-90">{stat.label}</div>
          </div>
        ))}
      </StaggerContainer>
    </Section>
  );
}
