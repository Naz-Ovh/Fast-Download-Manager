// Closing call to action on an ink panel (dark in both themes) with the chunk logo.
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import { ChunkMark } from './chunk-mark';
import { CtaButtons } from './cta-buttons';

export function FinalCta() {
  return (
    <section className="pb-16 sm:pb-24">
      <Container>
        <Reveal className="lp-ink lp-final">
          <div aria-hidden className="lp-final-bg" />
          <span aria-hidden className="lp-final-streak fdm-streak" style={{ top: '22%' }} />
          <span aria-hidden className="lp-final-streak fdm-streak" style={{ top: '68%', animationDelay: '1.7s' }} />
          <ChunkMark size={88} motion="loop" className="lp-final-mark" />
          <h2 className="fdm-heading text-3xl text-[#e6f2ee] sm:text-5xl">Your next download, in parallel.</h2>
          <p className="max-w-xl text-lg text-[#8fa8a1]">
            Install the app, add the extension, and let every file come down in segments.
          </p>
          <CtaButtons className="justify-center" />
        </Reveal>
      </Container>
    </section>
  );
}
