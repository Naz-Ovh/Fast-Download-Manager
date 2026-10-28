// The not-found page: navbar, Fumadocs' "not found" message, footer. The router renders it for any unknown URL;
// the build writes it as out/404.html (src/start.ts), which the host answers unknown paths with.
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { DefaultNotFound } from 'fumadocs-ui/layouts/home/not-found';
import { Footer } from '@/components/ui/footer';
import { baseOptions } from '@/lib/layout.shared';

export function NotFound() {
  return (
    <>
      <HomeLayout {...baseOptions()}>
        <DefaultNotFound />
      </HomeLayout>
      <Footer />
    </>
  );
}
