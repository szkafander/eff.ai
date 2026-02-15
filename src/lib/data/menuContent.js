/**
 * Content for menu items in the sidebar
 */

const menuContent = {
	'about-fairy': {
		title: 'About Fairy',
		content: `
			<p><strong>Fairy</strong> is your friendly neighborhood AI assistant – except not really an AI at all!</p>
			<p>Behind the sparkles and smooth animations lies a simple truth: Fairy is powered by hard-coded responses and basic pattern matching. No neural networks, no machine learning, no cloud computing. Just good old-fashioned JavaScript if-statements.</p>
			<p>Think of Fairy as a theatrical performance of what an AI <em>might</em> be like, if that AI had a sense of humor about its own limitations.</p>
			<p>Created as a playful critique of the modern AI hype cycle, Fairy reminds us that not everything that looks intelligent actually is – and that's okay! Sometimes the smoke and mirrors are part of the fun.</p>
		`
	},
	'energy-use': {
		title: 'On LLM Energy Use',
		content: `
			<p><strong>Let's talk about the elephant in the data center:</strong> Large Language Models consume enormous amounts of energy.</p>
			<p>Training a single large AI model can emit as much carbon as five cars over their entire lifetimes. Running these models at scale requires massive server farms that consume electricity 24/7.</p>
			<p>Meanwhile, Fairy runs entirely in your browser using approximately 0.0001% of the energy of a real LLM. No servers, no data centers, no cooling systems – just your device's processor executing a few lines of JavaScript.</p>
			<p>As we rush headlong into an AI-powered future, it's worth asking: do we really need a massive neural network for every task? Or could simpler solutions work just as well for many applications?</p>
			<p>Fairy may be a joke, but the energy costs of AI are anything but.</p>
		`
	},
	'ai-effects': {
		title: 'The Societal Effects of AI',
		content: `
			<p><strong>AI is reshaping society</strong> – but not always in the ways tech companies promise.</p>
			<p>We're told AI will augment human creativity, democratize knowledge, and solve complex problems. And sometimes it does! But we're also seeing: job displacement, algorithmic bias, environmental costs, concentration of power in tech giants, and the erosion of critical thinking as people defer to "what the AI said."</p>
			<p>There's also the cultural impact: as AI-generated content floods the internet, what happens to human creativity? When AI can produce "good enough" writing, art, and code, do we risk devaluing the human effort behind these crafts?</p>
			<p>Fairy exists as a gentle parody – a reminder to question the hype, consider the costs, and remember that not every problem needs an AI solution. Sometimes the simplest answer is the best one.</p>
			<p>Technology should serve humanity, not the other way around.</p>
		`
	},
	'about-us': {
		title: 'About Us',
		content: `
			<p><strong>We're just folks</strong> who think the current AI moment deserves a bit of critical examination – with humor.</p>
			<p>This project was born from a simple observation: modern AI chatbots have very slick interfaces that make them feel authoritative and intelligent. But what if we built the same interface for something that's explicitly <em>not</em> intelligent?</p>
			<p>The result is Fairy – a chatbot that looks the part but freely admits it's just smoke and mirrors. It's a small act of technological honesty in a world full of AI snake oil.</p>
			<p>We believe in:</p>
			<p>• <strong>Appropriate technology</strong> – using the right tool for the job<br>
			• <strong>Environmental responsibility</strong> – questioning energy-intensive solutions<br>
			• <strong>Human creativity</strong> – valuing human effort over synthetic output<br>
			• <strong>Critical thinking</strong> – not believing the hype</p>
			<p>Thanks for chatting with Fairy. We hope it made you smile – and maybe think a little too.</p>
		`
	}
};

export function getMenuContent(itemId) {
	return menuContent[itemId] || { title: 'Not Found', content: '<p>Content not found.</p>' };
}

