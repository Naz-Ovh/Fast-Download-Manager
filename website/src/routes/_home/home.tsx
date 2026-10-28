// /home renders the same page as / (a static site has no server redirects), with the same head tags.
import { createFileRoute } from '@tanstack/react-router';
import { HomePage, homeHead } from '@/components/landing/home-page';

export const Route = createFileRoute('/_home/home')({
  head: homeHead,
  component: HomePage,
});
