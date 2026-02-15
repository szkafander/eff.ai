<script>
	let { steps = [], visible = true } = $props();
</script>

{#if visible && steps.length > 0}
	<div class="thinking-block" class:fading={!visible}>
		<div class="thinking-header">
			<span class="thinking-icon">💭</span>
			<span class="thinking-label">Thinking…</span>
		</div>
		<div class="thinking-steps">
			{#each steps as step, i (i)}
				<div class="thinking-step" style="animation-delay: {i * 60}ms">
					<span class="step-text">{step}</span>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.thinking-block {
		align-self: flex-start;
		flex-shrink: 0;
		max-width: 70%;
		background: #1a1a1a;
		border: 1px solid #2a2a2a;
		border-left: 3px solid #667eea;
		border-radius: 12px;
		padding: 12px 16px;
		animation: fadeSlideIn 0.25s ease-out;
		transition: opacity 0.35s ease, transform 0.35s ease;
	}

	.thinking-block.fading {
		opacity: 0;
		transform: translateY(-6px) scale(0.97);
	}

	@keyframes fadeSlideIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.thinking-header {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 8px;
	}

	.thinking-icon {
		font-size: 14px;
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}

	.thinking-label {
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		background: linear-gradient(
			90deg,
			#667eea 0%,
			#a78bfa 40%,
			#667eea 80%
		);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: shimmerLabel 2s linear infinite;
	}

	@keyframes shimmerLabel {
		0% { background-position: 100% 0; }
		100% { background-position: -100% 0; }
	}

	.thinking-steps {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.thinking-step {
		font-size: 13px;
		line-height: 1.5;
		font-style: italic;
		animation: stepIn 0.25s ease-out both;
		position: relative;
		overflow: hidden;
	}

	.step-text {
		background: linear-gradient(
			90deg,
			#888 0%,
			#bbb 25%,
			#888 50%
		);
		background-size: 300% 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: shimmerText 2.5s ease-in-out infinite;
	}

	@keyframes shimmerText {
		0% { background-position: 100% 0; }
		100% { background-position: -100% 0; }
	}

	@keyframes stepIn {
		from {
			opacity: 0;
			transform: translateX(4px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@media (max-width: 768px) {
		.thinking-block {
			max-width: 85%;
		}
	}
</style>
