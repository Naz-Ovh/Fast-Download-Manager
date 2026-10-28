// Features grid: eight cards with the hover lift + mint ring, revealed with a fast 40 ms stagger.
import { Combine, FolderTree, Gauge, Globe, Languages, ListVideo, MonitorPlay, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';

const FEATURES = [
  {
    icon: Gauge,
    title: 'Segmented engine',
    tag: 'up to 32 connections',
    body: 'Every file is split across parallel connections, 8 by default. New connections take half of the largest range left.',
  },
  {
    icon: Globe,
    title: 'Browser capture',
    tag: 'Chrome · Edge · Brave · Firefox',
    body: 'Downloads arrive with their cookies, referrer and headers. Hold Alt to keep one in the browser, Ctrl to force it.',
  },
  {
    icon: MonitorPlay,
    title: 'Video on any page',
    tag: 'in-page button',
    body: 'A small button sits in the player’s corner with every quality. The toolbar popup lists each video on the page.',
  },
  {
    icon: ListVideo,
    title: 'HLS and DASH streams',
    tag: 'HLS · DASH',
    body: 'HLS playlists, AES-128 encrypted ones too, and DASH manifests save as one file, with a menu of every quality.',
  },
  {
    icon: Combine,
    title: 'Remux without ffmpeg',
    tag: 'MP4 · fMP4 · TS · MKV',
    body: 'Our own Rust code merges video and audio into MP4 or MKV, and turns TS and fragmented MP4 into a normal MP4.',
  },
  {
    icon: RotateCcw,
    title: 'Resume and retries',
    tag: 'saved segment list',
    body: 'Stop any time. The segment list is saved, so the download picks up where it left off. Failed connections retry.',
  },
  {
    icon: FolderTree,
    title: 'Categories and limiter',
    tag: 'per-file speed limit',
    body: 'Files sort into category folders by type and site. A speed limiter leaves bandwidth for everything else.',
  },
  {
    icon: Languages,
    title: '39 languages',
    tag: 'right to left',
    body: 'The app follows your system language and mirrors for Arabic, Persian and Hebrew. The extension speaks 17.',
  },
];

export function Features() {
  return (
    <Section
      id="features"
      eyebrow="Features"
      title="Everything between the click and the file."
      lead="One engine for files, streams and video, and a browser extension that hands everything over."
    >
      <Reveal stagger={40} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, tag, body }) => (
          <Card key={title} interactive className="lp-feature flex flex-col gap-3">
            <span className="lp-feature-icon">
              <Icon aria-hidden />
            </span>
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="text-sm leading-relaxed text-fd-muted-foreground">{body}</p>
            <p className="lp-feature-tag fdm-num">{tag}</p>
          </Card>
        ))}
      </Reveal>
    </Section>
  );
}
