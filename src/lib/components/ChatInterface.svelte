<script>
	import { tick } from 'svelte';
	import { chatStore } from '$lib/stores/chatStore.js';
	import { getLogicById, models, getModelName } from '$lib/logics/index.js';
	import { FairyController } from '$lib/logics/FairyController.js';
	import Message from './Message.svelte';
	import ThinkingBlock from './ThinkingBlock.svelte';

	let input = $state('');
	let isTyping = $state(false);
	let isProcessing = $state(false);
	let thinkingSteps = $state([]);
	let thinkingVisible = $state(false);
	let shouldStreamLast = $state(false);
	let animatingTextbox = $state(false);   // true while textbox rewrite is playing
	let messagesContainer;

	function sleepMs(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	// Track which chat a running logic belongs to so we can
	// ignore its UI callbacks after the user switches away.
	let processingChatId = $state(null);

	let activeChat = $derived($chatStore.chats.find(c => c.id === $chatStore.activeChat));
	let messages = $derived(activeChat?.messages || []);
	let logic = $derived(activeChat ? getLogicById(activeChat.logicId) : undefined);

	// Reset visual state whenever the active chat changes
	$effect(() => {
		const _id = $chatStore.activeChat;
		resetVisualState();
	});

	function resetVisualState() {
		isTyping = false;
		thinkingSteps = [];
		thinkingVisible = false;
		shouldStreamLast = false;
		animatingTextbox = false;
	}

	async function scrollToBottom(smooth = false) {
		await tick();
		await new Promise(r => requestAnimationFrame(r));
		if (!messagesContainer) return;

		if (smooth) {
			// Extra frame to ensure the DOM has settled after state changes
			await new Promise(r => requestAnimationFrame(r));
			messagesContainer.scrollTo({
				top: messagesContainer.scrollHeight,
				behavior: 'smooth'
			});
		} else {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	}

	async function sendMessage() {
		if (!input.trim() || !activeChat || !logic) return;
		// Allow sending even if another chat is processing —
		// but block double-sends within the same chat
		if (isProcessing && processingChatId === activeChat.id) return;

		const userMessage = input.trim();
		const chatId = activeChat.id;

		// Capture the logic ref before any async gap
		const chatLogic = logic;

		// Mark this chat as the one being processed
		isProcessing = true;
		processingChatId = chatId;

		// For logics that animate the textbox, DON'T add the message yet —
		// the text stays in the input and the animation handles everything.
		if (!chatLogic.animatesInput) {
			input = '';
			if (textareaEl) textareaEl.style.height = 'auto';
			chatStore.addMessage(chatId, { role: 'user', content: userMessage });
			scrollToBottom();
		}

		// Helper: only touch UI state if this chat is still active
		const isStillActive = () => $chatStore.activeChat === chatId;

		const controller = new FairyController({
			setTyping(visible) {
				if (!isStillActive()) return;
				isTyping = visible;
				scrollToBottom();
			},

			addThinkingStep(step) {
				if (!isStillActive()) return;
				thinkingVisible = true;
				thinkingSteps = [...thinkingSteps, step];
				scrollToBottom();
			},

			setThinkingSteps(steps) {
				if (!isStillActive()) return;
				thinkingVisible = true;
				thinkingSteps = [...steps];
				scrollToBottom();
			},

			clearThinking() {
				if (!isStillActive()) {
					return Promise.resolve();
				}
				return new Promise(resolve => {
					thinkingVisible = false;
					setTimeout(() => {
						thinkingSteps = [];
						resolve();
					}, 400);
				});
			},

			rewriteUserMessage(content) {
				// Always apply — this modifies store data, not UI
				chatStore.rewriteLastUserMessage(chatId, content);
				if (isStillActive()) scrollToBottom();
			},

			async animateRewriteUserMessage(newContent) {
				// input still contains the user's original text (wasn't cleared)
				animatingTextbox = true;

				// Brief pause so it feels like "processing"
				await sleepMs(200);

				// ── Backspace phase ──
				const backspaceTick = 22;
				const origLen = input.length;
				const backspaceChars = Math.max(1, Math.ceil(origLen / 30));

				while (input.length > 0) {
					input = input.slice(0, Math.max(0, input.length - backspaceChars));
					autoResize();
					await sleepMs(backspaceTick);
				}

				await sleepMs(200);

				// ── Type phase ──
				const typeTick = 16;
				const typeChars = Math.max(1, Math.ceil(newContent.length / 80));

				let pos = 0;
				while (pos < newContent.length) {
					pos = Math.min(pos + typeChars, newContent.length);
					input = newContent.slice(0, pos);
					autoResize();
					await sleepMs(typeTick);
				}

				// Let the user read the new question briefly
				await sleepMs(500);

				// "Send" — add the rewritten message to the store, clear textbox
				input = '';
				if (textareaEl) textareaEl.style.height = 'auto';
				animatingTextbox = false;
				chatStore.addMessage(chatId, { role: 'user', content: newContent });
				if (isStillActive()) scrollToBottom();
			},

			addReply(content) {
				// Always apply — this modifies store data, not UI
				if (isStillActive()) shouldStreamLast = true;
				chatStore.addMessage(chatId, {
					role: 'assistant',
					content
				});
				if (isStillActive()) scrollToBottom();
			}
		});

		try {
			await chatLogic.respond(userMessage, messages, controller);
		} finally {
			// Only reset processing UI if this chat is still active
			if (processingChatId === chatId) {
				isProcessing = false;
				processingChatId = null;
			}
			if (isStillActive()) {
				resetVisualState();
				scrollToBottom();
			}
		}
	}

	let textareaEl;

	function autoResize() {
		if (!textareaEl) return;
		textareaEl.style.height = 'auto';
		textareaEl.style.height = textareaEl.scrollHeight + 'px';
	}

	function handleKeydown(event) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	function handleStreamEnd() {
		shouldStreamLast = false;
		// Smooth scroll to reveal the full message once streaming finishes
		scrollToBottom(true);
	}

	$effect(() => {
		// Scroll to bottom whenever thinking steps or typing state change
		thinkingSteps;
		isTyping;
		scrollToBottom();
	});

	// ── Model selector ──────────────────────────────────────────
	let modelDropdownOpen = $state(false);
	let currentModelName = $derived(activeChat ? getModelName(activeChat.logicId) : models[0].name);

	function selectModel(modelId) {
		if (!activeChat) return;
		chatStore.setLogicId(activeChat.id, modelId);
		modelDropdownOpen = false;
	}

	function toggleModelDropdown() {
		modelDropdownOpen = !modelDropdownOpen;
	}

	// Close dropdown when clicking outside
	function handleWindowClick(e) {
		if (modelDropdownOpen && !e.target.closest('.model-selector')) {
			modelDropdownOpen = false;
		}
	}
</script>

<svelte:window onclick={handleWindowClick} />

<div class="chat-container">
	<div class="chat-header">
		<div class="header-content">
			<div class="logo">
				<span class="logo-icon">✨</span>
				<span class="logo-text">Fairy</span>
			</div>
		</div>
	</div>

	<div class="messages" bind:this={messagesContainer}>
		{#each messages as message, i (message)}
			<Message
				role={message.role}
				content={message.content}
				streaming={shouldStreamLast && i === messages.length - 1 && message.role === 'assistant'}
				onStreamEnd={handleStreamEnd}
			/>
		{/each}
		<ThinkingBlock steps={thinkingSteps} visible={thinkingVisible} />
		{#if isTyping}
			<div class="typing-indicator">
				<div class="typing-dot"></div>
				<div class="typing-dot"></div>
				<div class="typing-dot"></div>
			</div>
		{/if}
	</div>

	<div class="input-container">
		<div class="input-card">
			<div class="input-row">
				<textarea
					bind:this={textareaEl}
					bind:value={input}
					oninput={autoResize}
					onkeydown={handleKeydown}
					placeholder="Message Fairy..."
					rows="1"
					readonly={animatingTextbox}
					disabled={!animatingTextbox && isProcessing && processingChatId === activeChat?.id}
				></textarea>
				<button
					onclick={sendMessage}
					disabled={!input.trim() || (isProcessing && processingChatId === activeChat?.id)}
					class="send-button"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
			<div class="input-footer">
				<div class="model-selector">
					<button class="model-pill" onclick={toggleModelDropdown}>
						<span class="model-label">model:</span>
						<svg class="model-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
						</svg>
						<span class="model-name">{currentModelName}</span>
						<svg class="chevron" class:open={modelDropdownOpen} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
							<path d="M6 9l6 6 6-6"/>
						</svg>
					</button>
					{#if modelDropdownOpen}
						<div class="model-dropdown">
							{#each models as model}
								<button
									class="model-option"
									class:active={activeChat?.logicId === model.id}
									onclick={() => selectModel(model.id)}
								>
									<span class="option-radio">
										{#if activeChat?.logicId === model.id}
											<span class="radio-dot"></span>
										{/if}
									</span>
									<span class="option-name">{model.name}</span>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.chat-container {
		flex: 1;
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #0d0d0d;
	}

	.chat-header {
		padding: 16px 24px;
		border-bottom: 1px solid #2a2a2a;
		background: #0d0d0d;
		backdrop-filter: blur(10px);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.logo-icon {
		font-size: 24px;
	}

	.logo-text {
		font-size: 18px;
		font-weight: 600;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.messages {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.messages::-webkit-scrollbar {
		width: 8px;
	}

	.messages::-webkit-scrollbar-track {
		background: transparent;
	}

	.messages::-webkit-scrollbar-thumb {
		background: #2a2a2a;
		border-radius: 4px;
	}

	.messages::-webkit-scrollbar-thumb:hover {
		background: #3a3a3a;
	}

	.typing-indicator {
		display: flex;
		gap: 4px;
		padding: 12px 16px;
		align-self: flex-start;
		background: #1a1a1a;
		border-radius: 18px;
		animation: typingFadeIn 0.15s ease-out;
	}

	@keyframes typingFadeIn {
		from {
			opacity: 0;
			transform: scale(0.85);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.typing-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #666;
		animation: typing 0.7s infinite;
	}

	.typing-dot:nth-child(2) {
		animation-delay: 0.1s;
	}

	.typing-dot:nth-child(3) {
		animation-delay: 0.2s;
	}

	@keyframes typing {
		0%, 55%, 100% { transform: translateY(0); }
		25% { transform: translateY(-10px); }
	}

	.input-container {
		padding: 12px 24px 20px;
		background: #0d0d0d;
	}

	.input-card {
		background: #1a1a1a;
		border: 1px solid #2a2a2a;
		border-radius: 18px;
		transition: border-color 0.2s;
		overflow: visible;
	}

	.input-card:focus-within {
		border-color: #667eea;
	}

	.input-row {
		display: flex;
		gap: 12px;
		align-items: center;
		padding: 10px 12px 8px 16px;
	}

	.input-footer {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 8px 6px;
		border-top: 1px solid #222;
	}

	textarea {
		flex: 1;
		background: transparent;
		border: none;
		color: #ececec;
		font-size: 15px;
		resize: none;
		outline: none;
		font-family: inherit;
		max-height: 200px;
		line-height: 1.5;
		padding: 0;
		margin: 0;
		overflow: hidden;
		height: auto;
		box-sizing: border-box;
	}

	textarea:disabled {
		opacity: 0.5;
	}

	textarea::placeholder {
		color: #666;
	}

	.send-button {
		background: #667eea;
		border: none;
		border-radius: 50%;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s;
		flex-shrink: 0;
		color: white;
	}

	.send-button:hover:not(:disabled) {
		background: #5568d3;
		transform: scale(1.05);
	}

	.send-button:disabled {
		background: #2a2a2a;
		cursor: not-allowed;
		opacity: 0.5;
	}

	/* ── Model selector ──────────────────────────────── */

	.model-selector {
		position: relative;
	}

	.model-pill {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		background: transparent;
		border: none;
		color: #777;
		font-size: 12px;
		font-family: inherit;
		cursor: pointer;
		padding: 5px 8px;
		border-radius: 6px;
		transition: background 0.15s, color 0.15s;
		line-height: 1;
	}

	.model-pill:hover {
		background: #252525;
		color: #bbb;
	}

	.model-label {
		color: #555;
		font-size: 11px;
		margin-right: 1px;
	}

	.model-icon {
		opacity: 0.6;
		flex-shrink: 0;
	}

	.model-name {
		font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
		letter-spacing: -0.01em;
	}

	.chevron {
		opacity: 0.5;
		transition: transform 0.2s;
		flex-shrink: 0;
	}

	.chevron.open {
		transform: rotate(180deg);
	}

	.model-dropdown {
		position: absolute;
		bottom: calc(100% + 6px);
		right: 0;
		background: #1a1a1a;
		border: 1px solid #2a2a2a;
		border-radius: 10px;
		padding: 4px;
		min-width: 240px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
		animation: dropdownSlideIn 0.12s ease-out;
		z-index: 50;
	}

	@keyframes dropdownSlideIn {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.model-option {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		background: transparent;
		border: none;
		color: #ccc;
		font-size: 13px;
		font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
		padding: 8px 10px;
		border-radius: 7px;
		cursor: pointer;
		transition: background 0.1s;
		text-align: left;
	}

	.model-option:hover {
		background: #252525;
	}

	.model-option.active {
		color: #ececec;
	}

	.option-radio {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 2px solid #444;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition: border-color 0.15s;
	}

	.model-option.active .option-radio {
		border-color: #667eea;
	}

	.radio-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #667eea;
	}

	.option-name {
		letter-spacing: -0.01em;
	}
</style>
