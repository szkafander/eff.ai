# Fairy ✨

**Fairy** is the flagship alpha product of [eff.ai](https://eff.ai) — a bootstrapped AI startup building frontier-class language model performance at a fraction of the computational cost.

Fairy delivers inference quality comparable to leading LLMs while consuming roughly **1/100th of the energy per query**.

## Why This Matters

The energy cost of modern AI is growing faster than almost any other technology sector. The International Energy Agency estimates that data center electricity consumption — driven largely by AI workloads — now exceeds 1,000 TWh annually, approaching the total electricity consumption of Japan. A single query to a frontier LLM is estimated to consume 5–10 Wh, roughly ten times that of a traditional web search. At billions of queries per day globally, the aggregate draw is enormous.

But energy cost is not just an environmental concern — it is an access problem. When inference is expensive, AI becomes a service available primarily to well-funded institutions and consumers in wealthy economies. A 2024 study from the Oxford Internet Institute found that access to capable AI tools is already stratifying along existing economic fault lines, with users in the Global South disproportionately reliant on smaller, less capable models or priced out entirely.

Fairy's architecture reduces inference energy to approximately **0.05–0.1 Wh per query** — two orders of magnitude below comparable frontier models. On an individual level, an active user generating 100 queries per day would consume roughly 5–10 Wh, or about 2–3.5 kWh over an entire year of heavy use. That is comparable to running a laptop for a single afternoon.

The implications cascade. Lower energy per query means lower cost per query. Lower cost means deployment in contexts where AI was previously uneconomical: rural clinics, offline-capable educational tools, low-bandwidth environments, personal devices without cloud dependencies. A 2024 McKinsey report estimated that generative AI could add $2.6–4.4 trillion in annual value to the global economy — but only if access is broad enough to reach the workforce that would benefit most.

We believe intelligence doesn't have to be expensive. It just has to be well-engineered.

## Getting Started

Requires [Node.js](https://nodejs.org/) 18+.

```bash
git clone https://github.com/your-org/eff.ai.git
cd eff.ai
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Build & Deploy

```bash
npm run build     # Production build
npm run preview   # Preview locally
```

Deployed on [Vercel](https://vercel.com). Push to `main` and Vercel handles the rest, or use the CLI:

```bash
npx vercel
```

## Tech Stack

- **Svelte 5** / **SvelteKit** — reactive UI framework
- **Vite** — build tooling
- **Vercel** — hosting and edge deployment

## License

Proprietary. See [LICENSE](LICENSE) for full terms. © 2024–2026 eff.ai. All rights reserved.

**This software may not be used for AI training, machine learning, or automated data collection. See Section 3 of the license.**
