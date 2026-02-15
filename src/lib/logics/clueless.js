/**
 * Clueless Logic
 *
 * Simulates someone on the other end frantically typing, stopping, thinking,
 * deleting, retyping — for 20–30 agonising seconds — then delivers a
 * spectacularly unhelpful one-liner riddled with typos.
 */

const replies = [
	'what?',
	'huh?',
	'what do you mean?',
	'i don\'t get it',
	'sorry, what?',
	'can you say that again?',
	'wait, what?',
	'i\'m confused',
	'uhhh',
	'hmm?',
	'i don\'t understand',
	'that\'s crazy',
	'ok, and?',
	'sorry, i wasn\'t listening',
	'hold on, what?',
	'i don\'t know what you\'re saying',
	'what are you talking about?',
	'come again?',
	'sorry, i\'m lost',
	'i have no idea what that means',
	'can you rephrase that?',
	'you lost me',
	'yeah, i don\'t know',
	'to be honest, i have no clue',
	'wait, say that again?',
	'could you repeat that?',
	'i\'m not following',
	'that doesn\'t make sense to me',
	'i really don\'t know',
	'can you explain that differently?',
];

/**
 * Simulate typos by randomly swapping adjacent non-whitespace characters.
 * @param {string} text - The clean input text
 * @param {number} probability - Chance (0–1) that any eligible character gets swapped
 * @returns {string} Text with simulated typos
 */
function addTypos(text, probability = 0.08) {
	const chars = [...text];
	// Walk left-to-right; skip the last char (nothing to swap with)
	for (let i = 0; i < chars.length - 1; i++) {
		// Only swap two adjacent non-whitespace characters
		if (chars[i] === ' ' || chars[i + 1] === ' ') continue;
		if (Math.random() < probability) {
			const tmp = chars[i];
			chars[i] = chars[i + 1];
			chars[i + 1] = tmp;
			i++; // skip the swapped-in char so we don't double-swap
		}
	}
	return chars.join('');
}

const thinkingSnippets = [
	'Analyzing your query...',
	'Processing natural language input...',
	'Consulting knowledge base...',
	'Running inference...',
	'Cross-referencing data sources...',
	'Evaluating semantic context...',
	'Parsing intent...',
	'Generating response candidates...',
	'Ranking candidate outputs...',
	'Applying safety filters...',
	'Hmm, let me think about this more carefully...',
	'Considering edge cases...',
	'Double-checking my reasoning...',
	'Almost there...',
	'Reconsidering from scratch...',
	'Wait, let me re-read the question...',
];

function pick(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function pickUnique(arr, exclude) {
	const filtered = arr.filter(x => !exclude.includes(x));
	return filtered.length > 0 ? pick(filtered) : pick(arr);
}

function randBetween(min, max) {
	return min + Math.random() * (max - min);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export const clueless = {
	id: 'clueless',
	name: 'Clueless',
	greeting: 'Hello! I\'m Fairy, your efficient AI assistant. Ask me anything!',

	/**
	 * @param {string} _userMessage
	 * @param {Array<{role: string, content: string}>} _messages
	 * @param {import('./FairyController.js').FairyController} fairy
	 */
	async respond(_userMessage, _messages, fairy) {
		const totalTime = randBetween(20000, 30000);
		const start = Date.now();
		const remaining = () => totalTime - (Date.now() - start);
		const usedThinking = [];
		let isFirstCycle = true;

		while (remaining() > 0) {
			if (isFirstCycle) {
				// ── Always start with an erratic typing burst ──
				isFirstCycle = false;
				const burstCount = Math.floor(randBetween(3, 7));
				for (let i = 0; i < burstCount && remaining() > 0; i++) {
					fairy.setTyping(true);
					await sleep(Math.min(randBetween(300, 2500), remaining()));
					if (remaining() <= 0) break;
					fairy.setTyping(false);
					await sleep(Math.min(randBetween(150, 600), remaining()));
				}
				continue;
			}

			// Decide what to do this cycle: type, or show thinking
			const roll = Math.random();

			if (roll < 0.35 && remaining() > 4000) {
				// ── Show a thinking message for a bit ──
				fairy.setTyping(false);
				const snippet = pickUnique(thinkingSnippets, usedThinking);
				usedThinking.push(snippet);
				await fairy.think(snippet, { delay: Math.min(randBetween(2000, 4000), remaining()) });
				await fairy.clearThinking();

			} else {
				// ── Erratic typing burst ──
				const burstCount = Math.floor(randBetween(2, 6));
				for (let i = 0; i < burstCount && remaining() > 0; i++) {
					fairy.setTyping(true);
					await sleep(Math.min(randBetween(300, 2500), remaining()));
					if (remaining() <= 0) break;
					fairy.setTyping(false);
					await sleep(Math.min(randBetween(150, 600), remaining()));
				}
			}

			// Occasional longer pause as if they deleted everything
			if (remaining() > 0 && Math.random() < 0.3) {
				fairy.setTyping(false);
				await sleep(Math.min(randBetween(400, 1200), remaining()));
			}
		}

		fairy.setTyping(false);
		await fairy.replyTyped(addTypos(pick(replies)), {
			baseDelay: 160,
			jitter: 120,
			mistypeChance: 0.18,
			mistypeDelay: 280,
			backspaceDelay: 140,
			pauseChance: 0.12,
			pauseMin: 500,
			pauseMax: 1400,
		});
	}
};
