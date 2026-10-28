// /download: every way to get Fast Download Manager. Data: src/lib/downloads.ts. Components and styles:
// src/components/download/ (download.css).
import { createFileRoute } from '@tanstack/react-router';
import { DownloadHero } from '@/components/download/hero';
import { DownloadMatrix } from '@/components/download/matrix';
import { InsideSection, RequirementsSection, StepsSection, VerifySection } from '@/components/download/sections';
import { Section } from '@/components/ui/section';
import { pageHead } from '@/lib/head';
import { site } from '@/lib/site';
import downloadCss from '@/components/download/download.css?url';

export const Route = createFileRoute('/_home/download')({
  head: () =>
    pageHead({
      title: 'Download',
      description: `Download ${site.name} for Windows, Linux and macOS: the .msi installer, .deb, .rpm, pacman and AppImage packages, a one-line Linux installer, the disk images, the browser extension and the fdm command.`,
      canonical: '/download/',
      styles: [downloadCss],
    }),
  component: DownloadPage,
});

// Section's own padding is py-16/sm:py-24 (cn merges the override); this page is a bit denser.
const sectionClass = 'py-14 sm:py-20';

function DownloadPage() {
  return (
    <div className="dl-page">
      <DownloadHero />

      <Section
        id="all-downloads"
        className={sectionClass}
        eyebrow="All downloads"
        title="Every platform, every format"
        lead="Each package holds the whole product, so you install once. Windows comes first."
      >
        <DownloadMatrix />
      </Section>

      <Section
        id="inside"
        className={`${sectionClass} dl-band`}
        eyebrow="In the box"
        title="One package, the whole product"
        lead="The same four parts ship in every package, on every platform."
      >
        <InsideSection />
      </Section>

      <Section
        id="steps"
        className={sectionClass}
        eyebrow="Get started"
        title="Install in three steps"
        lead="From the installer to your first split download."
      >
        <StepsSection />
      </Section>

      <Section id="requirements" className="pt-0 pb-14 sm:pt-0 sm:pb-20" eyebrow="Requirements" title="What you need">
        <RequirementsSection />
      </Section>

      <Section
        id="verify"
        className={`${sectionClass} dl-band`}
        eyebrow="Checksums"
        title="Verify your download"
        lead="Each file lists its SHA-256 next to it once it is released. Run the command for your system and compare."
      >
        <VerifySection />
      </Section>
    </div>
  );
}
