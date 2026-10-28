// Detects the visitor's desktop platform after hydration. The server (and the first client render) always
// says 'windows', so the static HTML carries the Windows button and only its text can change afterwards.
import { useEffect, useState } from 'react';
import type { Platform } from '@/lib/site';

interface UaDataNavigator extends Navigator {
  userAgentData?: { platform?: string; mobile?: boolean };
}

/**
 * Client Hints platform first (`navigator.userAgentData.platform`), then `navigator.platform`, then the user
 * agent. Phones, tablets and ChromeOS get the default, Windows: there is no build for them.
 */
export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'windows';
  const nav = navigator as UaDataNavigator;
  const ua = nav.userAgent.toLowerCase();
  const platform = (nav.userAgentData?.platform || nav.platform || '').toLowerCase();

  const mobile =
    nav.userAgentData?.mobile === true ||
    /android|iphone|ipad|ipod|cros/.test(ua) ||
    /android|ios|chrome os|chromeos/.test(platform) ||
    // iPadOS reports a Mac platform; a Mac has no multi-touch screen.
    (platform.startsWith('mac') && nav.maxTouchPoints > 1);
  if (mobile) return 'windows';

  if (platform.startsWith('win')) return 'windows';
  if (platform.startsWith('mac')) return 'macos';
  if (platform.includes('linux') || platform.includes('x11')) return 'linux';
  if (ua.includes('windows')) return 'windows';
  if (ua.includes('mac os x') || ua.includes('macintosh')) return 'macos';
  if (ua.includes('linux') || ua.includes('x11')) return 'linux';
  return 'windows';
}

/** The detected platform; 'windows' on the server and until the effect runs. */
export function usePlatform(): Platform {
  const [platform, setPlatform] = useState<Platform>('windows');
  useEffect(() => setPlatform(detectPlatform()), []);
  return platform;
}
