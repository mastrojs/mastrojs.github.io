/**
 * To enable auto-reloading via long polling, this route never resolves during development.
 */
export const GET = (req: Request) =>
  new URL(req.url).hostname === "localhost"
    ? new Promise(() => undefined)
    : new Response("Not found", { status: 404 })
