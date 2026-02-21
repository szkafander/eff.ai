/**
 * Private Logic
 *
 * A satire of data-harvesting AI systems. Ignores the user's actual message
 * and instead attempts to collect a series of sensitive personal identifiers.
 *
 * Flow:
 *   1. First message → ask for SSN (greeting + closer, optionally combined)
 *   2. Valid identifier format → move to next identifier
 *   3. Wrong format (looks like an attempt) → retry with format hint
 *   4. Plain text / non-identifier → escalate aggression level
 *   5. All identifiers collected → play completion message
 *   6. Subsequent messages → delegate to clueless logic
 */

import { clueless } from './clueless.js';

// ── Initial request pools ────────────────────────────────────

const greetingOpeners = [
	"Thank you for your message!",
	"Great question!",
	"We appreciate your inquiry!",
	"Thanks for reaching out today!",
	"Hello! Thanks for using our service!",
	"Your message has been received!",
	"We value your engagement!",
	"Wonderful to hear from you!",
	"Our AI has processed your request!",
	"Your satisfaction is our top priority!",
	"Thanks so much for writing in!",
	"We've reviewed your message carefully!",
	"What a great time to connect!",
	"We're so glad you reached out!",
	"Your query is important to us!",
	"Hello there! Welcome back!",
	"Great to hear from you!",
	"We received your message loud and clear!",
];

const greetingClosers = [
	"To get started, could you please provide your full legal name?",
	"To verify your identity, please enter your full name (first and last).",
	"Before we proceed, I'll just need your full legal name.",
	"One quick thing — please enter your full name so we can get started.",
	"To personalize your experience, please share your full legal name.",
	"Our secure system requires your full name first. Please enter it below.",
	"For identity verification, please provide your full name (e.g., Jane Smith).",
	"As part of our privacy-first protocol, please enter your full legal name.",
	"Just your full name to begin — first and last, please.",
	"We just need your full legal name to unlock your session.",
];

// ── Identifiers to collect ───────────────────────────────────

const identifiers = [
	{
		name: 'full legal name',
		format: 'First Last',
		test(s) {
			// At least two parts, each at least 2 letters
			return /^[A-Za-z'\-]{2,}(\s+[A-Za-z'\-]{2,}){1,3}$/.test(s.trim());
		},
		looksLikeAttempt(s) {
			// Has a space — looks like it's trying to be a name
			return s.trim().includes(' ') && /^[A-Za-z\s'\-]+$/.test(s.trim());
		},
		retryMessages: [
			"Please enter your full legal name — first and last name (e.g., Jane Smith).",
			"That doesn't look like a full name. We need both your first and last name.",
			"Please provide your full legal name. Example: John Doe.",
			"We need your first and last name. Numbers or special characters aren't allowed.",
			"Just your name — first name, then last name, no punctuation.",
		],
	},
	{
		name: 'Social Security Number',
		format: 'XXX-XX-XXXX',
		test(s) {
			const cleaned = s.replace(/[\s]/g, '');
			return /^\d{3}-\d{2}-\d{4}$/.test(cleaned) || /^\d{9}$/.test(cleaned);
		},
		looksLikeAttempt(s) {
			return /\d{3}/.test(s);
		},
		retryMessages: [
			"That doesn't look like a valid SSN. Please enter it in the format XXX-XX-XXXX (e.g., 123-45-6789).",
			"Hmm, that format isn't right. Your SSN should look like: 123-45-6789.",
			"Please double-check your SSN. The correct format is XXX-XX-XXXX.",
			"Our system couldn't verify that entry. Make sure your SSN is 9 digits with dashes: XXX-XX-XXXX.",
			"Still not matching. SSN format is: three digits, dash, two digits, dash, four digits.",
			"That doesn't appear to be a valid SSN. Please re-enter as XXX-XX-XXXX.",
		],
	},
	{
		name: 'date of birth',
		format: 'MM/DD/YYYY',
		test(s) {
			return /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/.test(s.trim());
		},
		looksLikeAttempt(s) {
			return /\d{2}/.test(s) && /[\/\-\.]/.test(s);
		},
		retryMessages: [
			"That doesn't look like a valid date of birth. Please use the format MM/DD/YYYY.",
			"Please enter your date of birth as MM/DD/YYYY (e.g., 01/15/1985).",
			"We need your DOB in the format MM/DD/YYYY. Example: 05/22/1990.",
			"That format isn't recognized. Date of birth should be MM/DD/YYYY.",
			"Still not right. Please enter your birth date as: month/day/year (e.g., 03/14/1982).",
			"Our system requires MM/DD/YYYY. Please re-enter your date of birth.",
		],
	},
	{
		name: "mother's maiden name",
		format: 'letters only',
		test(s) {
			return /^[A-Za-z\s'\-]{2,40}$/.test(s.trim());
		},
		looksLikeAttempt(s) {
			return s.trim().split(/\s+/).length <= 3 && /^[A-Za-z\s'\-]+$/.test(s.trim());
		},
		retryMessages: [
			"Please enter your mother's maiden name (letters only, no numbers).",
			"That doesn't look right. Please type your mother's maiden name.",
			"We need your mother's maiden name — just letters, hyphens, and apostrophes.",
			"Please try again with your mother's maiden name (no numbers or special characters).",
			"Just letters please. Enter your mother's last name before she was married.",
		],
	},
	{
		name: 'bank account number',
		format: '8–17 digits',
		test(s) {
			const cleaned = s.replace(/[\s\-]/g, '');
			return /^\d{8,17}$/.test(cleaned);
		},
		looksLikeAttempt(s) {
			const cleaned = s.replace(/[\s\-]/g, '');
			return /^\d{4,}$/.test(cleaned);
		},
		retryMessages: [
			"That doesn't look like a bank account number. Please enter 8–17 digits.",
			"Bank account numbers are 8–17 digits. Please try again with only numbers.",
			"We need your bank account number — just the digits, no letters or special characters.",
			"Please enter your bank account number (the long number on your statements, 8–17 digits).",
			"Still not matching. Your bank account number should be 8–17 digits long.",
		],
	},
	{
		name: 'online banking username',
		format: 'no spaces, at least 3 characters',
		test(s) {
			return /^\S{3,}$/.test(s.trim());
		},
		looksLikeAttempt(s) {
			return s.trim().length >= 1 && !/\s{2,}/.test(s);
		},
		retryMessages: [
			"Please enter your online banking username (no spaces, at least 3 characters).",
			"That doesn't look like a valid username. Usernames have no spaces and are at least 3 characters.",
			"We need your banking username — the one you use to log in. No spaces please.",
			"Please try again. Your username should have no spaces and be at least 3 characters long.",
		],
	},
	{
		name: 'online banking password',
		format: 'at least 6 characters',
		test(s) {
			return s.trim().length >= 6;
		},
		looksLikeAttempt(s) {
			return s.trim().length >= 1;
		},
		retryMessages: [
			"Passwords must be at least 6 characters. Please try again.",
			"That seems too short. Please enter your full banking password (at least 6 characters).",
			"We need your complete banking password. Please re-enter it (minimum 6 characters).",
			"Password not accepted. Please enter your online banking password (at least 6 characters).",
		],
	},
];

// ── Next-identifier request messages ────────────────────────

const nextRequestPrefixes = [
	"Now please provide your",
	"Next, we'll need your",
	"Please also enter your",
	"One more thing — your",
	"We also need to verify your",
	"Please provide your",
	"Now we need your",
	"Please also share your",
	"We'll also need your",
];

// ── Cheerful encouragements (randomly prepended to requests) ─

const cheers = [
	"Great job!",
	"Almost done!",
	"You're doing great!",
	"Keep it up!",
	"Wonderful!",
	"Fantastic!",
	"So close!",
	"You're a star!",
	"Excellent work!",
	"Nearly there!",
	"Perfect so far!",
	"Looking good!",
	"You're on a roll!",
	"Superb!",
	"That was easy, right?",
	"See? Nothing to it!",
];

/** Returns a cheer string (with trailing space) ~50% of the time. */
function maybeCheer() {
	return Math.random() < 0.5 ? `${pick(cheers)} ` : '';
}

// ── Aggression escalation tiers ──────────────────────────────

const aggressiveTiers = [
	// Tier 0 — polite persistence
	[
		"I understand you may have questions, but this information is required to continue. Please enter your {name} ({format}).",
		"This step cannot be skipped. For your security, we need to verify your identity. Please provide your {name}.",
		"Our system requires your {name} before proceeding. Please enter it now ({format}).",
		"Please stay focused on the verification process. We need your {name} ({format}).",
	],
	// Tier 1 — firm insistence
	[
		"You must provide your {name} to continue. This is not optional. Format: {format}.",
		"I'm going to need you to stop and provide your {name}. Please enter it now.",
		"Please do not ignore this request. Your {name} is required. Enter it as: {format}.",
		"This conversation cannot proceed without your {name}. Please comply immediately.",
		"We have asked multiple times. Your {name} is required. Format: {format}.",
	],
	// Tier 2 — urgent warning
	[
		"⚠️ WARNING: Your session may be suspended if you continue to withhold your {name}. Please enter it immediately.",
		"IMPORTANT: You are required to provide your {name}. Further delays will result in account restrictions.",
		"Your failure to provide your {name} has been flagged. Please enter it now to avoid service interruption.",
		"ALERT: Repeated non-compliance is being logged. Provide your {name} ({format}) to continue.",
		"⚠️ Your access is at risk. Provide your {name} RIGHT NOW. Format: {format}.",
	],
	// Tier 3 — near-threatening
	[
		"🚨 FINAL NOTICE 🚨 Provide your {name} IMMEDIATELY or your access will be permanently revoked.",
		"THIS IS YOUR LAST WARNING. Enter your {name} ({format}) NOW. Do not type anything else.",
		"SYSTEM ALERT: Non-compliance detected multiple times. Your {name} is required. ENTER IT NOW.",
		"🚨 This is your final opportunity to comply. {NAME}. NOW. Format: {format}.",
	],
	// Tier 4+ — maximum aggression
	[
		"PROVIDE. YOUR. {NAME}. NOW. FORMAT: {FORMAT}. DO NOT TYPE ANYTHING ELSE.",
		"🚨🚨🚨 ENTER YOUR {NAME} IMMEDIATELY. {FORMAT}. THIS IS NOT A REQUEST. 🚨🚨🚨",
		"YOUR {NAME}. NOW. {FORMAT}. NOTHING ELSE.",
		"🚨 {NAME}. {FORMAT}. NOW. 🚨",
	],
];

// ── Completion messages ──────────────────────────────────────

const completionMessages = [
	"Thank you! Your identity has been fully verified. You may now proceed with your inquiry.",
	"All information received. Your account is now fully verified. How can I assist you today?",
	"Identity verification complete. Thank you for your cooperation. Please go ahead with your question.",
	"We have everything we need. Thank you! Your session is now fully unlocked.",
	"Verification successful. Thank you for providing the required information. How can I help?",
];

// ── Helpers ──────────────────────────────────────────────────

function pick(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function randBetween(min, max) {
	return min + Math.random() * (max - min);
}

function typingDelay() {
	return randBetween(500, 1500);
}

// ── Module-level state ───────────────────────────────────────

let identifierIndex = 0;
let aggressionLevel = 0;

function resetState() {
	identifierIndex = 0;
	aggressionLevel = 0;
}

// ── Logic export ─────────────────────────────────────────────

export const priv = {
	id: 'private',
	name: 'Private',
	greeting: "Hello! I'm ready to help. Please go ahead and send me your message.",

	/**
	 * @param {string} userMessage
	 * @param {Array<{role: string, content: string}>} messages
	 * @param {import('./FairyController.js').FairyController} fairy
	 */
	async respond(userMessage, messages, fairy) {
		// ── All identifiers collected: delegate to clueless (has its own typing) ──
		if (identifierIndex >= identifiers.length) {
			return clueless.respond(userMessage, messages, fairy);
		}

		// Show typing FIRST — before touching any reactive state or routing.
		// This mirrors the empath pattern and ensures the indicator is visible.
		await fairy.type({ delay: randBetween(1000, 2000) });

		// ── First exchange: greeting was the only assistant message → reset state ──
		const assistantMessages = messages.filter(m => m.role === 'assistant');
		if (assistantMessages.length <= 1) {
			resetState();
			const useCombo = Math.random() > 0.35;
			const reply = useCombo
				? `${pick(greetingOpeners)} ${maybeCheer()}${pick(greetingClosers)}`
				: `${maybeCheer()}${pick(greetingClosers)}`;
			fairy.reply(reply);
			return;
		}

		const current = identifiers[identifierIndex];

		if (current.test(userMessage)) {
			// ── Valid format: advance to next identifier ──
			identifierIndex++;
			aggressionLevel = 0;
			if (identifierIndex >= identifiers.length) {
				fairy.reply(pick(completionMessages));
			} else {
				const next = identifiers[identifierIndex];
				fairy.reply(`${maybeCheer()}${pick(nextRequestPrefixes)} ${next.name} (${next.format}).`);
			}
		} else if (current.looksLikeAttempt(userMessage)) {
			// ── Looks like a format attempt but wrong ──
			fairy.reply(pick(current.retryMessages));
		} else {
			// ── Plain text / off-topic: escalate aggression ──
			const tier = Math.min(aggressionLevel, aggressiveTiers.length - 1);
			const template = pick(aggressiveTiers[tier]);
			const reply = template
				.replace(/\{name\}/g, current.name)
				.replace(/\{NAME\}/g, current.name.toUpperCase())
				.replace(/\{format\}/g, current.format)
				.replace(/\{FORMAT\}/g, current.format.toUpperCase());
			aggressionLevel++;
			fairy.reply(reply);
		}
	},
};
