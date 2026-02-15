<script>
	import { tick } from 'svelte';
	import { chatStore } from '$lib/stores/chatStore.js';
	import { getLogicById } from '$lib/logics/index.js';
	import { FairyController } from '$lib/logics/FairyController.js';
	import Message from './Message.svelte';
	import ThinkingBlock from './ThinkingBlock.svelte';

	let input = $state('');
	let isTyping = $state(false);
	let isProcessing = $state(false);
	let thinkingSteps = $state([]);
	let thinkingVisible = $state(false);
	let shouldStreamLast = $state(false);
	let messagesContainer;

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
		input = '';
		if (textareaEl) textareaEl.style.height = 'auto';

		// Add user message
		chatStore.addMessage(chatId, {
			role: 'user',
			content: userMessage
		});
		scrollToBottom();

		// Mark this chat as the one being processed
		isProcessing = true;
		processingChatId = chatId;

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

		// Capture the logic ref before the async gap
		const chatLogic = logic;

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
</script>

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
		<div class="input-wrapper">
			<textarea
				bind:this={textareaEl}
				bind:value={input}
				oninput={autoResize}
				onkeydown={handleKeydown}
				placeholder="Message Fairy..."
				rows="1"
				disabled={isProcessing && processingChatId === activeChat?.id}
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
		padding: 16px 24px 24px;
		border-top: 1px solid #2a2a2a;
		background: #0d0d0d;
	}

	.input-wrapper {
		display: flex;
		gap: 12px;
		align-items: center;
		background: #1a1a1a;
		border: 1px solid #2a2a2a;
		border-radius: 24px;
		padding: 8px 12px 8px 16px;
		transition: border-color 0.2s;
	}

	.input-wrapper:focus-within {
		border-color: #667eea;
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
</style>
