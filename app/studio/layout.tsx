export const metadata = {
  title: 'Sanity Studio',
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
