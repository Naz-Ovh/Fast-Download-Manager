// Landing page: src/components/landing/home-page.tsx.
import { createFileRoute } from '@tanstack/react-router';
import { HomePage, homeHead } from '@/components/landing/home-page';

export const Route = createFileRoute('/_home/')({
  head: homeHead,
  component: HomePage,
});
