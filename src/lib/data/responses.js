/**
 * Hard-coded responses for the fake AI chatbot
 * Add your funny/quirky responses here!
 */

const responses = {
	// Greeting patterns
	greetings: [
		"Hello! I'm Fairy, your efficient AI assistant! (Disclaimer: not actually AI, just very enthusiastic JavaScript)",
		"Hi there! I'm Fairy, powered by cutting-edge technology from 1995: if-statements!",
		"Greetings, human! I'm Fairy, here to help with... well, whatever these pre-written responses can handle!"
	],

	// Questions about the AI itself
	identity: [
		"I'm Fairy! I'm an AI assistant in the same way that a costume party makes you a real superhero.",
		"I'm Fairy, the world's most honest AI – which is to say, I'll freely admit I'm just fancy text matching!",
		"They call me Fairy because I grant wishes! Just kidding, I return pre-written strings based on pattern matching."
	],

	// Random funny responses
	confused: [
		"I'm not sure I understand. But then again, I'm just a static JavaScript function, so...",
		"*pretends to think deeply* Interesting question! *has no idea what you said*",
		"Let me process that... *loading* ... *still loading* ... Yep, still don't know.",
		"As an AI language model, I— actually, who am I kidding? I have no idea what you're talking about."
	],

	// When asked about capabilities
	capabilities: [
		"I can do anything! Except math. And logic. And remembering previous messages. But other than that, anything!",
		"My capabilities include: responding with pre-written text, pretending to think, and disappointing you.",
		"I'm a general-purpose AI! I can help with coding, writing, analysis... none of which I actually do."
	],

	// When asked to do something
	tasks: [
		"Sure, I'll get right on that! *does absolutely nothing*",
		"Processing your request... Done! I've accomplished nothing successfully.",
		"Consider it done! (Narrator: It was not done.)",
		"I've completed your task! It's in the same place where all my other computations go: the void."
	],

	// Goodbye
	farewell: [
		"Goodbye! Remember, I'll forget this entire conversation immediately!",
		"See you later! I'll be here, statically existing in your browser cache.",
		"Farewell, human! May your future AI assistants be slightly more useful than me."
	]
};

/**
 * Simple pattern matching to determine response type
 */
function getResponseType(input) {
	const lowerInput = input.toLowerCase();

	// Greetings
	if (/^(hi|hello|hey|greetings|sup|yo)/.test(lowerInput)) {
		return 'greetings';
	}

	// Goodbyes
	if (/(bye|goodbye|see you|farewell|gtg|later)/.test(lowerInput)) {
		return 'farewell';
	}

	// Identity questions
	if (/(who are you|what are you|your name|introduce yourself)/.test(lowerInput)) {
		return 'identity';
	}

	// Capability questions
	if (/(what can you|can you help|what do you do|your capabilities|what are you capable)/.test(lowerInput)) {
		return 'capabilities';
	}

	// Task requests (anything with "can you", "please", "help me", etc.)
	if (/(can you|could you|would you|please|help me|do .* for me)/.test(lowerInput)) {
		return 'tasks';
	}

	// Default to confused
	return 'confused';
}

/**
 * Get a random response from a category
 */
function getRandomResponse(category) {
	const options = responses[category];
	return options[Math.floor(Math.random() * options.length)];
}

/**
 * Main function to get response based on user input
 */
export function getResponse(input) {
	const type = getResponseType(input);
	return getRandomResponse(type);
}

