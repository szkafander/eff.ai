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
}

