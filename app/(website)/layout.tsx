import { Header } from '@/components/Header';
import { logger } from '@/lib/logger';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { ToastProvider } from '@/components/ui/Toast';
import { client } from '@/lib/sanity.client';
import { siteSettingsQuery, navigationQuery } from '@/lib/sanity.queries';

async function getGlobalData() {
  try {
    const [siteSettings, navigation] = await Promise.all([
      client.fetch(siteSettingsQuery),
      client.fetch(navigationQuery),
    ]);
    return { siteSettings, navigation };
  } catch (error) {
    logger.error('Error fetching global data:', error);
    return { siteSettings: null, navigation: null };
  }
}

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { siteSettings, navigation } = await getGlobalData();

  return (
    <ToastProvider>
      <Header
        siteSettings={siteSettings}
        navigation={navigation}
      />
      <main className="min-h-screen">{children}</main>
      <Footer siteSettings={siteSettings} navigation={navigation} />
      <BackToTop />
    </ToastProvider>
  );
}
