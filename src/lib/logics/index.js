/**
 * Logic Registry
 *
 * Each logic defines a different "personality" or behavior for Fairy.
 * When a new chat session is created, one logic is chosen at random.
 *
 * A logic is an object with:
 *   - id: string          — unique identifier
 *   - name: string        — human-readable name
 *   - greeting: string    — the first message shown when the chat starts
 *   - respond(userMessage, messages, fairy): Promise<void>
 *       An async function that orchestrates the response using the
 *       FairyController instance (`fairy`). Available methods:
 *
 *         await fairy.type()                  — show typing dots briefly
 *         await fairy.type({ delay: 1000 })   — custom duration
 *         fairy.setTyping(true|false)          — manual typing control
 *         await fairy.think('step text')       — add a CoT thinking step
 *         await fairy.setThinking(['a','b'])   — replace all steps at once
 *         await fairy.clearThinking()          — animate out & remove steps
 *         fairy.reply('final answer')          — send the assistant message
 */

import { clueless } from './clueless.js';
import { scholar } from './scholar.js';
import { venting } from './venting.js';

/** All available logics. Add new ones here. */
export const logics = [
	clueless,
	scholar,
	venting,
];

/** Map for fast lookup by id */
const logicMap = Object.fromEntries(logics.map(l => [l.id, l]));

/**
 * Pick a random logic from the registry.
 * @returns {object} A logic object
 */
export function pickRandomLogic() {
	return logics[Math.floor(Math.random() * logics.length)];
}

/**
 * Retrieve a logic by its id.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getLogicById(id) {
	return logicMap[id];
}
