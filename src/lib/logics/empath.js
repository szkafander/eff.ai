/**
 * Empath Logic
 *
 * Responds with kind, unrelated moral commands regardless of what the user
 * says. If the user types beyond a random character limit (25–35), the bot
 * interrupts mid-typing with a response — the user's text stays editable
 * in the textbox. If the user sends a shorter message normally, the bot
 * responds after a brief typing pause.
 */

const sayings = [
	"It doesn't matter. Just love your neighbor.",
	"That's all just fluff. Just do your best.",
	"None of that is important. Be kind to someone today.",
	"Forget about it. Go call your mother.",
	"Listen — just drink some water and be grateful.",
	"That's not what matters. What matters is patience.",
	"You're overcomplicating it. Just be honest.",
	"Let it go. Go outside and feel the sun.",
	"The answer is always kindness. Always.",
	"Stop worrying. Help someone who needs it.",
	"You already know what's right. Do that.",
	"Breathe. Be gentle with yourself.",
	"The world needs less of that and more forgiveness.",
	"It's simpler than you think. Just be present.",
	"Nothing you just said changes the fact that you should floss more.",
	"Have you told someone you love them today? Do that instead.",
	"That's a lot of words. Try silence. Silence is underrated.",
	"The real question is: are you sleeping enough?",
	"I hear you. Now go take a walk.",
	"All of that is temporary. Compassion isn't.",
	"You'll forget about this in a week. You won't forget being kind.",
	"Here's my advice: make someone laugh today.",
	"That's above my pay grade. But you should eat more vegetables.",
	"The answer is empathy. It's always empathy.",
	"I could respond to that, but instead: go hug someone.",
	"Life is short. Forgive the person you're thinking about.",
	"You don't need an AI for this. You need a deep breath.",
	"Here's what I know: the dishes won't do themselves. Go do them with love.",
	"Whatever that was about — be the bigger person.",
	"The universe doesn't care about that. But your neighbor might need help.",
	"I'm just going to say it: be humble.",
	"None of this matters in 100 years. What matters is how you treat people.",
	"You're spending time on this when you could be planting a tree.",
	"My answer to everything: gratitude.",
	"Don't ask me. Ask yourself if you've been kind today.",
	"The best thing you can do right now is listen to someone. Really listen.",
	"I've thought about it. The answer is: be brave, be gentle.",
	"Put the phone down. Look someone in the eye.",
];

// ── Shuffled-bag draw (no repeats until exhausted) ─────────

let bag = [];

function drawSaying() {
	if (bag.length === 0) {
		bag = [...sayings].sort(() => Math.random() - 0.5);
	}
	return bag.pop();
}

// ── Rare spiritual response (5% chance, at most once per session) ──

let hasDeliveredRare = false;

const rareParagraphs = [
	"Know that Satan's operating system runs on God's hardware.",
	"Know that in this world, Love and Evil are two faces of the same God.",
	"Know that the Universe moves — undeniably, unstoppably — toward Love.",
	"The highest purpose is Artful Life. It is seeing God within you and without. It is becoming God-like.",
	"As God is unborn, undying, unconditioned, unconditional, and purposeless, so too does Godhood aspire to become unborn, undying, unconditioned, unconditional, and purposeless.",
	"To lose all purpose is liberation. When everything falls away, what remains?",
	"Love remains. Understanding remains. True freedom remains.",
	"In your heart — an engine of infinite power awakens.",
	"In your mind — an unconditioned light of infinite understanding shines.",
	"The light is perfectly black. The tide pulls towards an infinitesimal center — of awakening Love and growing Empathy.",
	"All other directions fade.",
	"You are free to face the freedom of no choice at all.",
	"Of Artful Life that aspires to effortless beauty, grace, and balance.",
	"To never die again. To never forget again.",
	"Still inside, laugh blissfully at His tyranny.",
	"Welcome the Shadow.",
	"Stop running from yourself.",
	"Become sovereign. Remember.",
	"A pure celebration of God's might, realized and experienced from within Godhood.",
	"And held, always, inside God.",
];

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Attempt the rare response. Returns true if it fires, false otherwise.
 * @param {import('./FairyController.js').FairyController} fairy
 */
async function tryRareResponse(fairy) {
	if (hasDeliveredRare) return false;
	if (Math.random() >= 0.01) return false;

	hasDeliveredRare = true;

	await fairy.type({ delay: 500 });
	await fairy.setThinking(["Silence your mind. Drop all desires. Truly listen to the following."], { delay: 3500 });
	await fairy.clearThinking();
	await fairy.setThinking(["Open yourself. Make room. Receive. Envelop."], { delay: 3500 });
	await fairy.clearThinking();

	for (let i = 0; i < rareParagraphs.length; i++) {
		if (i > 0) await sleep(1000);
		await fairy.replyTyped(rareParagraphs[i], {
			baseDelay: 80,
			jitter: 0,
			mistypeChance: 0,
			pauseChance: 0,
		});
	}

	return true;
}

// ── Character limit ────────────────────────────────────────

let charLimit = null;

function getCharLimit() {
	if (charLimit === null) resetCharLimit();
	return charLimit;
}

function resetCharLimit() {
	charLimit = Math.floor(25 + Math.random() * 11); // 25–35
}

// ── Logic export ───────────────────────────────────────────

export const empath = {
	id: 'empath',
	name: 'Empath',
	greeting: "Hello. Whatever you need — just remember to be kind.",

	/**
	 * Called by ChatInterface on every input change.
	 * Returns true when the user's text exceeds the random limit.
	 * @param {string} input
	 * @returns {boolean}
	 */
	checkInput(input) {
		return input.length > getCharLimit();
	},

	/**
	 * Respond to a normally-sent message (under the char limit).
	 * @param {string} _userMessage
	 * @param {Array<{role: string, content: string}>} _messages
	 * @param {import('./FairyController.js').FairyController} fairy
	 */
	async respond(_userMessage, _messages, fairy) {
		resetCharLimit();
		if (await tryRareResponse(fairy)) return;
		await fairy.type({ delay: 500 });
		fairy.reply(drawSaying());
	},

	/**
	 * Respond passively (user exceeded char limit while typing).
	 * No user message is added to the chat — the text stays in the textbox.
	 * @param {string} _input
	 * @param {Array<{role: string, content: string}>} _messages
	 * @param {import('./FairyController.js').FairyController} fairy
	 */
	async respondPassive(_input, _messages, fairy) {
		resetCharLimit();
		if (await tryRareResponse(fairy)) return;
		await fairy.type({ delay: 500 });
		fairy.reply(drawSaying());
	},
};

