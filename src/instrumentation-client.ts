import posthog from "posthog-js";

if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
    defaults: "2026-05-30",
  });
}

export function onRouterTransitionStart(url: string) {
  posthog.capture("$pageview", { $current_url: url });
}
