// Route transfer line: a 2 px mint line fixed at the very top of the viewport that runs 0 to 100% in 350 ms
// and fades whenever the pathname changes (client-side navigation). Nothing on the first load: the landing hero
// plays its own boot line. Mounted once in src/routes/__root.tsx; styles .fdm-route-progress in global.css
// (opacity only under reduced motion). Pathname only, no loading events, so a cached route still shows the line.
import { useLocation } from '@tanstack/react-router';
import { useState } from 'react';

export function RouteProgress() {
  const pathname = useLocation({ select: (location) => location.pathname });
  // Previous pathname and a run counter, updated during render (no effect): every change remounts the line,
  // which restarts its CSS animation.
  const [state, setState] = useState({ path: pathname, run: 0 });
  if (state.path !== pathname) setState({ path: pathname, run: state.run + 1 });

  if (state.run === 0) return null;
  return <div key={state.run} className="fdm-route-progress" aria-hidden />;
}
