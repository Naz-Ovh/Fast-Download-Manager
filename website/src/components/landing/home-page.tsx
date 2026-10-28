// The landing page, rendered at / and at /home (src/routes/_home/index.tsx and home.tsx). Its styles:
// landing.css (prefix lp-), linked by homeHead().
import { Features } from './features';
import { FinalCta } from './final-cta';
import { Hero } from './hero';
import { HowItWorks } from './how-it-works';
import { Platforms } from './platforms';
import { RaceSection } from './race-section';
import { Ticker } from './ticker';
import { VideoSection } from './video-section';
import { pageHead } from '@/lib/head';
import { site } from '@/lib/site';
import landingCss from './landing.css?url';

/** Head tags of both routes; both canonicals point at /. */
export const homeHead = () =>
  pageHead({ absoluteTitle: site.name, description: site.description, canonical: '/', styles: [landingCss] });

export function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <RaceSection />
      <Features />
      <HowItWorks />
      <VideoSection />
      <Platforms />
      <FinalCta />
    </>
  );
}
