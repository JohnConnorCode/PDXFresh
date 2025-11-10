import { Metadata } from 'next';
import { client } from '@/lib/sanity.client';
import { blendsQuery } from '@/lib/sanity.queries';
import { Section } from '@/components/Section';
import { BlendCard } from '@/components/BlendCard';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Our Blends | Long Life',
  description: 'Explore our cold-pressed juice blends, each crafted for specific wellness functions.',
};

async function getBlends() {
  try {
    return await client.fetch(blendsQuery);
  } catch (error) {
    console.error('Error fetching blends:', error);
    return [];
  }
}

export default async function BlendsPage() {
  const blends = await getBlends();

  return (
    <Section>
      <h1 className="font-heading text-5xl font-bold mb-4">Our Blends</h1>
      <p className="text-lg text-muted mb-12 max-w-2xl">
        Each blend is carefully crafted with cold-pressed organic ingredients to support your wellness journey.
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
