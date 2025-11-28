import { logger } from '@/lib/logger';
import { getSectionComponent, isSectionRegistered } from './section-registry';

interface SectionRendererProps {
  sections: any[];
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        const sectionType = section._type;

        if (!isSectionRegistered(sectionType)) {
          logger.warn(`Unknown section type: ${sectionType}`);
          return null;
        }

        const Component = getSectionComponent(sectionType);
        if (!Component) return null;

        return <Component key={section._key || index} {...section} />;
      })}
    </>
  );
}
