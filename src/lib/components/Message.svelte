<script>
	import { onMount } from 'svelte';

	let { role, content, streaming = false, cursor = false, onStreamEnd = () => {} } = $props();

	let streamProgress = $state(streaming && role === 'assistant' ? 0 : -1);
	let streamCursor = $state(streaming && role === 'assistant');

	let displayedContent = $derived(
		streamProgress >= 0 ? content.slice(0, streamProgress) : content
	);

	let showCursor = $derived(streamCursor || cursor);

	onMount(() => {
		if (!streaming || role !== 'assistant') return;

		// Aim for ~1–1.8s total regardless of length
		const charsPerTick = Math.max(1, Math.ceil(content.length / 60));

		const interval = setInterval(() => {
			streamProgress += charsPerTick;
			if (streamProgress >= content.length) {
				streamProgress = -1;
				streamCursor = false;
				clearInterval(interval);
				onStreamEnd();
			}
		}, 22);

		return () => {
			clearInterval(interval);
			streamProgress = -1;
			streamCursor = false;
		};
	});
</script>

<div class="message" class:user={role === 'user'} class:assistant={role === 'assistant'}>
	{#if role === 'assistant'}
		<div class="avatar assistant-avatar">
			<span>🧚</span>
		</div>
	{/if}
	<div class="message-content">
		<div class="message-bubble">
			{displayedContent}{#if showCursor}<span class="streaming-cursor">▌</span>{/if}
		</div>
	</div>
	{#if role === 'user'}
		<div class="avatar user-avatar">
			<span>👤</span>
		</div>
	{/if}
</div>

<style>
	.message {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		animation: slideIn 0.3s ease-out;
	}

	.message.user {
		animation: userFadeIn 0.55s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes userFadeIn {
		from {
			opacity: 0;
			transform: translateY(8px) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.streaming-cursor {
		color: #667eea;
		animation: cursorBlink 0.53s step-end infinite;
		font-weight: 100;
		margin-left: 1px;
	}

	@keyframes cursorBlink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0; }
	}

	.message.user {
		flex-direction: row-reverse;
	}

	.avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		font-size: 16px;
	}

	.assistant-avatar {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.user-avatar {
		background: #2a2a2a;
	}

	.message-content {
		display: flex;
	}

	.message.user .message-content {
		justify-content: flex-end;
	}

	.message-bubble {
		display: inline-block;
		padding: 10px 16px;
		border-radius: 18px;
		line-height: 1.5;
		word-wrap: break-word;
		max-width: min(70vw, 600px);
		white-space: pre-wrap;
	}

	.assistant .message-bubble {
		background: #1a1a1a;
		border: 1px solid #2a2a2a;
	}

	.user .message-bubble {
		background: #667eea;
		color: white;
	}

	@media (max-width: 768px) {
		.message {
			gap: 8px;
		}

		.avatar {
			width: 28px;
			height: 28px;
			font-size: 14px;
		}

		.message-bubble {
			max-width: 80vw;
			padding: 8px 14px;
			font-size: 14px;
			border-radius: 16px;
		}
	}

	@media (max-width: 380px) {
		.message-bubble {
			max-width: 85vw;
		}
	}
</style>
