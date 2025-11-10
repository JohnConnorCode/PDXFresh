import { Metadata } from 'next';
import { client } from '@/lib/sanity.client';
import { blendsQuery, blendsPageQuery } from '@/lib/sanity.queries';
import { Section } from '@/components/Section';
import { BlendCard } from '@/components/BlendCard';

export const revalidate = 60;

async function getBlends() {
  try {
    return await client.fetch(blendsQuery);
  } catch (error) {
    console.error('Error fetching blends:', error);
    return [];
  }
}

async function getBlendsPage() {
  try {
    return await client.fetch(blendsPageQuery);
  } catch (error) {
    console.error('Error fetching blends page:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const blendsPage = await getBlendsPage();

  return {
    title: blendsPage?.seo?.metaTitle || 'Our Blends | Long Life',
    description: blendsPage?.seo?.metaDescription || 'Explore our cold-pressed juice blends, each crafted for specific wellness functions.',
  };
}

export default async function BlendsPage() {
  const blends = await getBlends();
  const blendsPage = await getBlendsPage();

  return (
    <Section>
      <h1 className="font-heading text-5xl font-bold mb-4">
        {blendsPage?.heading || 'Our Blends'}
      </h1>
      <p className="text-lg text-muted mb-12 max-w-2xl">
        {blendsPage?.subheading || 'Each blend is carefully crafted with cold-pressed organic ingredients to support your wellness journey.'}
      </p>

      {blends.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          {blends.map((blend: any) => (
            <BlendCard key={blend._id} blend={blend} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted">No blends available at the moment.</p>
        </div>
      )}
    </Section>
  );
}
