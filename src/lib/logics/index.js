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
import { empath } from './empath.js';
import { priv } from './private.js';

/** All available logics. Add new ones here. */
export const logics = [
	clueless,
	scholar,
	venting,
	empath,
	priv,
];

/** Model display names shown in the selector, mapped to logic ids */
export const models = [
	{ id: 'clueless',  name: 'eff-babydeer-mini' },
	{ id: 'venting',   name: 'eff.ai-1.2.3-thinking' },
	{ id: 'scholar',   name: 'eff-stable-genius-0.1-maxx' },
	{ id: 'empath',    name: 'eff-empath-0.7.3' },
	{ id: 'private',   name: 'eff-privacy-enhanced-1.0a' },
];

/** The default logic id for new chats */
export const DEFAULT_LOGIC_ID = 'clueless';

/** Map for fast lookup by id */
const logicMap = Object.fromEntries(logics.map(l => [l.id, l]));

/**
 * Retrieve a logic by its id.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getLogicById(id) {
	return logicMap[id];
}

/**
 * Get the display model name for a logic id.
 * @param {string} id
 * @returns {string}
 */
export function getModelName(id) {
	return models.find(m => m.id === id)?.name ?? id;
}
