/**
 * Content for menu items in the sidebar
 */

const menuContent = {
	'about-fairy': {
		title: 'About Fairy',
		content: `
			<p><strong>Fairy</strong> is the flagship alpha product of <strong>eff.ai</strong>, a bootstrapped AI startup founded in 2024 with a singular mission: to deliver frontier-class language model performance at a fraction of the computational cost. Fairy is built on a novel, proprietary architecture that achieves inference quality comparable to leading LLMs while consuming roughly <strong>1/100th of the energy per query</strong>.</p>
			<p>This breakthrough stems from years of research into efficient model design, aggressive quantization, and a rethinking of the transformer paradigm from first principles. Rather than scaling parameters into the trillions, our team focused on algorithmic efficiency — getting more intelligence per watt. The result is a model that runs lean, responds fast, and can be served from a single commodity server rather than a rack of high-end GPUs.</p>
			<p>We believe large language models will be one of the most transformative technologies of the coming decades. The ability to interact with knowledge through natural language — to ask questions, reason through problems, draft documents, learn new subjects, and automate routine cognitive work — will reshape industries from education and healthcare to law and engineering. Economists project that LLM-augmented workflows could boost global productivity by trillions of dollars annually within the next ten years.</p>
			<p>But this transformation can only reach its full potential if AI is <em>accessible</em>. Today, state-of-the-art models are expensive to run, controlled by a handful of large companies, and out of reach for most of the world's population. Fairy changes this equation. By reducing the compute required per interaction by two orders of magnitude, we dramatically lower the cost barrier — making advanced AI viable for individuals, small businesses, schools, and communities in developing nations who would otherwise be left behind.</p>
			<p>Fairy is currently in alpha. We're iterating fast, expanding capabilities, and working toward a public release that we believe will demonstrate that intelligence doesn't have to be expensive — it just has to be well-engineered.</p>
		`
	},
	'energy-use': {
		title: 'On LLM Energy Use',
		content: `
			<p><strong>The energy footprint of modern AI is staggering.</strong> A 2023 study by researchers at the University of Massachusetts Amherst estimated that training a single large language model can emit over 300 tonnes of CO₂ — equivalent to the lifetime emissions of five passenger cars. But training is only part of the picture. Inference — the process of actually answering user queries — now accounts for the majority of AI-related energy consumption as models are deployed at scale to hundreds of millions of users.</p>
			<p>The International Energy Agency estimates that data center electricity consumption, driven largely by AI workloads, now exceeds 1,000 TWh annually — roughly the total electricity consumption of Japan. A single query to a frontier LLM like GPT-4 is estimated to consume 5–10 Wh of energy, roughly ten times that of a traditional web search. Multiplied across billions of daily queries, the numbers become enormous.</p>
			<p>Fairy takes a fundamentally different approach. Through our proprietary architecture, a single Fairy query consumes approximately <strong>0.05–0.1 Wh</strong> — around 1/100th of what a comparable frontier model requires. To put this in perspective: if every ChatGPT query worldwide were served by Fairy instead, the aggregate energy savings would be on the order of several terawatt-hours per year — enough to power a mid-sized city.</p>
			<p>On an individual level, an active Fairy user generating 100 queries per day would consume roughly 5–10 Wh — comparable to leaving a small LED indicator light on for an hour. Over an entire year of heavy daily use, a Fairy user's total AI energy consumption would amount to about <strong>2–3.5 kWh</strong> — roughly what it takes to run a laptop for a single afternoon. By contrast, the same usage pattern on a conventional frontier model would consume 200–350 kWh — the equivalent of running a refrigerator for several months.</p>
			<p>This efficiency has cascading implications. Lower energy per query means lower cost per query, which means AI can be deployed in contexts where it was previously uneconomical: rural clinics, mobile-first educational tools, low-bandwidth environments, and personal devices with limited battery life. It also means that scaling AI access to the next billion users doesn't have to mean scaling energy infrastructure alongside it.</p>
			<p>The AI industry is at a crossroads. We can continue down the path of ever-larger models demanding ever-more energy, or we can invest in efficiency — getting more intelligence per joule. Fairy represents a proof of concept that the latter path is not only viable, but may ultimately be the more powerful one. The most transformative technology isn't always the biggest. Sometimes, it's the one that can run anywhere.</p>
		`
	},
	'ai-effects': {
		title: 'The Societal Effects of AI',
		content: `
			<p><strong>We are in the early stages of the most significant technological shift since the internet.</strong> Large language models and generative AI are already reshaping how we write, code, research, learn, and communicate. A 2024 McKinsey report estimated that generative AI could add $2.6–4.4 trillion in annual value to the global economy. But the societal implications extend far beyond GDP.</p>
			<p>In education, AI tutors can provide personalized, one-on-one instruction at a scale no school system could afford with human teachers alone. Medical professionals in underserved regions are using LLMs to assist with diagnostics and treatment planning where specialist access is limited. Legal aid organizations are deploying AI to help low-income individuals navigate complex bureaucratic systems. These are not hypothetical futures — they are happening now, in pilot programs and early deployments around the world.</p>
			<p>However, the benefits of AI are currently distributed unevenly. Access to the most capable models is gated by cost, infrastructure, and geography. A student in Helsinki and a student in Harare have vastly different access to AI tools, and this gap risks widening existing inequalities rather than closing them. Research from the Oxford Internet Institute suggests that without deliberate intervention, AI could concentrate economic gains in wealthy nations and among large technology firms, leaving developing economies further behind.</p>
			<p>This is where energy efficiency becomes a question of equity. A model that uses 1/100th the energy of its competitors can run on modest hardware, operate in low-connectivity environments, and be offered at price points accessible to individuals and organizations in the Global South. When the cost of a query drops by two orders of magnitude, the economics of AI access change fundamentally. Democratizing AI isn't just a technical challenge — it's a moral imperative.</p>
			<p>At the same time, we must be clear-eyed about the risks. AI systems can encode and amplify biases present in their training data. They can be used to generate misinformation at scale. They can displace workers in ways that, without thoughtful policy, leave communities behind. The deployment of AI surveillance tools raises serious concerns about civil liberties and privacy. None of these risks are reasons to halt progress, but they are reasons to proceed with care, transparency, and robust governance.</p>
			<p>We believe the path forward requires holding two ideas simultaneously: that AI is genuinely transformative and beneficial, <em>and</em> that it must be developed and deployed responsibly, with humanity's collective interest as the first priority. Technology is not destiny — it is a set of choices. The question is not whether AI will change society, but whether we will shape that change deliberately, equitably, and with the courage to course-correct when we get it wrong.</p>
		`
	},
	'about-us': {
		title: 'About Us',
		content: `
			<p><strong>eff.ai</strong> is a bootstrapped AI startup founded in 2024 with a singular mission: to deliver frontier-class language model performance at a fraction of the computational cost.</p>
			<p>We are a team of 3 people, all of us are engineers and we are all passionate about AI. We are based in the United States and Europe.</p>
			<p>Stay tuned for more updates!</p>
		`
	},
	'models': {
		title: 'Available Models',
		content: `
			<div style="margin-bottom: 20px;">
				<p style="margin-bottom: 4px;"><strong style="font-size: 15px; color: #ececec;">eff-babydeer-mini</strong></p>
				<p style="color: #667eea; font-size: 12px; margin-bottom: 8px;"><em>Lightweight · Low-resource · Personal use</em></p>
				<p>Our smallest model, designed for low-resource environments and personal use. Not ultra sophisticated, but sufficient for most use cases — and consumes less energy than a traditional web search.</p>
			</div>
			<div style="margin-bottom: 20px;">
				<p style="margin-bottom: 4px;"><strong style="font-size: 15px; color: #ececec;">eff.ai-1.2.3-thinking</strong></p>
				<p style="color: #667eea; font-size: 12px; margin-bottom: 8px;"><em>Flagship · Chain-of-thought · Transparent reasoning</em></p>
				<p>Our flagship thinking model. Eager, transparent, and step-by-step — it will tell you what it's thinking. Productive and thorough.</p>
			</div>
			<div>
				<p style="margin-bottom: 4px;"><strong style="font-size: 15px; color: #ececec;">eff-stable-genius-0.1-maxx</strong></p>
				<p style="color: #667eea; font-size: 12px; margin-bottom: 8px;"><em>Maximum capability · Research-grade · Multi-domain</em></p>
				<p>Our most powerful model. For the most demanding use cases that require multiple PhDs.</p>
			</div>
		`
	}
};

export function getMenuContent(itemId) {
	return menuContent[itemId] || { title: 'Not Found', content: '<p>Content not found.</p>' };
}

