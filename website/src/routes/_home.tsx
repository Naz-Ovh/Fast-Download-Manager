// Layout of the landing and download pages (pathless, adds nothing to the URL): Fumadocs HomeLayout (navbar)
// and the footer.
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Footer } from '@/components/ui/footer';
import { baseOptions } from '@/lib/layout.shared';

export const Route = createFileRoute('/_home')({
  component: Layout,
});

function Layout() {
  return (
    <>
      <HomeLayout {...baseOptions()}>
        <Outlet />
      </HomeLayout>
      <Footer />
    </>
  );
}
