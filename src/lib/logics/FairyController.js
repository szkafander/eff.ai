/**
 * FairyController
 *
 * Passed to each logic's `respond()` method, giving it control over
 * the typing indicator, thinking (CoT) messages, and the final reply.
 *
 * Usage inside a logic:
 *
 *   async respond(userMessage, messages, fairy) {
 *     await fairy.type();                          // show typing dots briefly
 *     await fairy.think('Let me consider...');     // show a thinking step
 *     await fairy.think('Interesting question.');  // replace with next step
 *     await fairy.clearThinking();                 // fade out thinking block
 *     fairy.reply('Here is my answer!');           // send the final message
 *   }
 *
 * All methods that accept a `delay` option will pause for that many ms
 * (defaults are randomised to feel natural). Thinking steps are displayed
 * one-at-a-time; each `think()` call adds a new step that is visible
 * alongside previous steps until `clearThinking()` is called.
 */

function randomDelay(base = 400, variance = 600) {
	return base + Math.random() * variance;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export class FairyController {
	/**
	 * @param {object} callbacks
	 * @param {(visible: boolean) => void}    callbacks.setTyping
	 * @param {(step: string) => void}        callbacks.addThinkingStep
	 * @param {(steps: string[]) => void}     callbacks.setThinkingSteps
	 * @param {() => Promise<void>}           callbacks.clearThinking  — should animate out then resolve
	 * @param {(content: string) => void}     callbacks.addReply
	 * @param {(content: string) => void}     callbacks.addReplyRaw      — like addReply but no streaming
	 * @param {(content: string) => void}     callbacks.updateReply      — update the last assistant msg
	 * @param {(show: boolean) => void}       callbacks.setLiveCursor    — show/hide blinking cursor
	 * @param {(content: string) => void}     callbacks.rewriteUserMessage
	 * @param {(content: string) => Promise<void>} callbacks.animateRewriteUserMessage
	 */
	constructor(callbacks) {
		/** @private */
		this._cb = callbacks;
	}

	// ── Typing indicator ────────────────────────────────────────

	/**
	 * Show the typing dots for a while, then hide them.
	 * @param {{ delay?: number }} opts
	 */
	async type(opts = {}) {
		this._cb.setTyping(true);
		await sleep(opts.delay ?? randomDelay(500, 800));
		this._cb.setTyping(false);
	}

	/**
	 * Manually show / hide the typing dots.
	 * @param {boolean} visible
	 */
	setTyping(visible) {
		this._cb.setTyping(visible);
	}

	// ── Thinking (Chain-of-Thought) messages ────────────────────

	/**
	 * Add a thinking step. Displayed immediately; pauses for `delay` ms
	 * so the reader can see it before the next action.
	 * @param {string} content
	 * @param {{ delay?: number }} opts
	 */
	async think(content, opts = {}) {
		this._cb.addThinkingStep(content);
		await sleep(opts.delay ?? randomDelay(600, 800));
	}

	/**
	 * Replace all current thinking steps at once (useful for rewrites).
	 * @param {string[]} steps
	 * @param {{ delay?: number }} opts
	 */
	async setThinking(steps, opts = {}) {
		this._cb.setThinkingSteps(steps);
		await sleep(opts.delay ?? randomDelay(400, 400));
	}

	/**
	 * Animate out and remove all thinking steps.
	 * Returns after the animation completes.
	 */
	async clearThinking() {
		await this._cb.clearThinking();
	}

	// ── User message rewrite ────────────────────────────────────

	/**
	 * Replace the last user message's content in the chat history.
	 * Useful for logics that override what the user "actually said".
	 * @param {string} content
	 */
	rewriteUserMessage(content) {
		this._cb.rewriteUserMessage(content);
	}

	/**
	 * Animated rewrite: quickly "backspaces" the user's message and
	 * "types" the new content in its place, then commits to the store.
	 * @param {string} content
	 */
	async animateRewriteUserMessage(content) {
		await this._cb.animateRewriteUserMessage(content);
	}

	// ── Final reply ─────────────────────────────────────────────

	/**
	 * Send the final assistant message to the chat.
	 * @param {string} content
	 */
	reply(content) {
		this._cb.addReply(content);
	}

	/**
	 * Type the reply character-by-character with jitter, pauses, and
	 * random mistypes that get backspaced and corrected.
	 * @param {string} content
	 * @param {object} [opts]
	 * @param {number} [opts.baseDelay=150]       avg ms between keystrokes
	 * @param {number} [opts.jitter=100]          ±ms of random jitter
	 * @param {number} [opts.mistypeChance=0.15]  probability of mistyping a char
	 * @param {number} [opts.mistypeDelay=250]    ms wrong char stays visible
	 * @param {number} [opts.backspaceDelay=120]  ms after backspacing before correct char
	 * @param {number} [opts.pauseChance=0.10]    probability of a long pause after a char
	 * @param {number} [opts.pauseMin=400]        min ms of a long pause
	 * @param {number} [opts.pauseMax=1200]       max ms of a long pause
	 */
	async replyTyped(content, opts = {}) {
		const {
			baseDelay = 150,
			jitter = 100,
			mistypeChance = 0.15,
			mistypeDelay = 250,
			backspaceDelay = 120,
			pauseChance = 0.10,
			pauseMin = 400,
			pauseMax = 1200,
		} = opts;

		// Add an empty message (no streaming animation)
		this._cb.addReplyRaw('');
		this._cb.setLiveCursor(true);

		let current = '';
		const chars = [...content];

		for (let i = 0; i < chars.length; i++) {
			const ch = chars[i];

			// ── Random mistype (skip for spaces / punctuation)
			if (ch.match(/[a-zA-Z]/) && Math.random() < mistypeChance) {
				const wrong = nearbyKey(ch);
				current += wrong;
				this._cb.updateReply(current);
				await sleep(mistypeDelay + Math.random() * 100);

				// Backspace the wrong char
				current = current.slice(0, -1);
				this._cb.updateReply(current);
				await sleep(backspaceDelay + Math.random() * 80);
			}

			// ── Type the correct character
			current += ch;
			this._cb.updateReply(current);

			// ── Jittered inter-keystroke delay
			const delay = Math.max(30, baseDelay + (Math.random() - 0.5) * 2 * jitter);
			await sleep(delay);

			// ── Occasional longer pause (thinking / hesitation)
			if (Math.random() < pauseChance) {
				await sleep(pauseMin + Math.random() * (pauseMax - pauseMin));
			}
		}

		this._cb.setLiveCursor(false);
	}
}

// ── Helpers ────────────────────────────────────────────────────

/** QWERTY adjacency map for realistic mistypes */
const qwertyNeighbors = {
	q: 'wa', w: 'qeas', e: 'wrds', r: 'etdf', t: 'ryfg',
	y: 'tugh', u: 'yijh', i: 'uokj', o: 'iplk', p: 'ol',
	a: 'qwsz', s: 'wedxza', d: 'erfcxs', f: 'rtgvcd', g: 'tyhbvf',
	h: 'yujnbg', j: 'uikmnh', k: 'ioljm', l: 'opk',
	z: 'asx', x: 'zsdc', c: 'xdfv', v: 'cfgb', b: 'vghn',
	n: 'bhjm', m: 'njk',
};

function nearbyKey(ch) {
	const lower = ch.toLowerCase();
	const neighbors = qwertyNeighbors[lower];
	if (!neighbors) return ch; // fallback: return same char
	const picked = neighbors[Math.floor(Math.random() * neighbors.length)];
	// Preserve original case
	return ch === ch.toUpperCase() ? picked.toUpperCase() : picked;
}

