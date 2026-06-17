import SiteHeader from '@/components/site-header';
import * as api from '@/lib/api';

export default async function WithHeaderLayout({ children }: { children: React.ReactNode }) {
  const categories = await api.getAllCategories();

  return (
    <>
      <SiteHeader categories={categories.data ?? []} />
      {children}
    </>
  );
}
