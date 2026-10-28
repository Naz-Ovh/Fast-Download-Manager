// The Start instance: request middleware.
import { createMiddleware, createStart } from '@tanstack/react-start';

// The build writes out/404.html by requesting /404, which no route matches, so it renders the router's own
// not-found branch: the same tree the client renders at any unknown URL, so that page hydrates cleanly. The
// prerenderer keeps only 200 responses, so this one passes as 200; the host still sends the file with 404.
const notFoundPage = createMiddleware().server(async ({ next, pathname }) => {
  const result = await next();
  if (pathname.replace(/\/$/, '') !== '/404' || result.response.status !== 404) return result;
  const { body, headers } = result.response;
  return new Response(body, { status: 200, headers });
});

export const startInstance = createStart(() => ({
  requestMiddleware: [notFoundPage],
}));
