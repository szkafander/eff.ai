<script>
	import { logics } from '$lib/logics/index.js';
	import { debugLogicOverride } from '$lib/stores/debugStore.js';

	let { onClose } = $props();
	let selected = $state($debugLogicOverride);

	function handleSelect(id) {
		selected = id;
		debugLogicOverride.set(id);
	}

	function handleReset() {
		selected = null;
		debugLogicOverride.set(null);
	}

	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}
</script>

<div class="modal-backdrop" onclick={handleBackdropClick}>
	<div class="modal">
		<div class="modal-header">
			<h2>🐛 Debug</h2>
			<button class="close-btn" onclick={onClose} aria-label="Close">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
				</svg>
			</button>
		</div>
		<div class="modal-content">
			<div class="section">
				<h3>Logic Override</h3>
				<p class="description">Force a specific logic for all new chats. Existing chats keep their assigned logic.</p>

				<div class="logic-list">
					<button
						class="logic-option"
						class:active={selected === null}
						onclick={handleReset}
					>
						<div class="logic-radio" class:checked={selected === null}></div>
						<div class="logic-info">
							<span class="logic-name">Random (default)</span>
							<span class="logic-desc">Randomly assigns a logic to each new chat</span>
						</div>
					</button>

					{#each logics as logic (logic.id)}
						<button
							class="logic-option"
							class:active={selected === logic.id}
							onclick={() => handleSelect(logic.id)}
						>
							<div class="logic-radio" class:checked={selected === logic.id}></div>
							<div class="logic-info">
								<span class="logic-name">{logic.name}</span>
								<span class="logic-id">{logic.id}</span>
							</div>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.modal {
		background: #1a1a1a;
		border: 1px solid #2a2a2a;
		border-radius: 16px;
		max-width: 480px;
		width: 90%;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
		animation: slideUp 0.3s ease-out;
	}

	@keyframes slideUp {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24px 24px 16px;
		border-bottom: 1px solid #2a2a2a;
	}

	h2 {
		margin: 0;
		font-size: 20px;
		font-weight: 600;
		color: #ececec;
	}

	.close-btn {
		background: transparent;
		border: none;
		color: #999;
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: all 0.2s;
	}

	.close-btn:hover {
		background: #2a2a2a;
		color: #ececec;
	}

	.modal-content {
		padding: 24px;
		overflow-y: auto;
	}

	.section h3 {
		margin: 0 0 4px 0;
		font-size: 14px;
		font-weight: 600;
		color: #ccc;
	}

	.description {
		margin: 0 0 16px 0;
		font-size: 13px;
		color: #777;
		line-height: 1.4;
	}

	.logic-list {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.logic-option {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 14px;
		background: #0d0d0d;
		border: 1px solid #2a2a2a;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.15s;
		text-align: left;
		width: 100%;
		color: #ececec;
	}

	.logic-option:hover {
		border-color: #3a3a3a;
		background: #141414;
	}

	.logic-option.active {
		border-color: #667eea;
		background: rgba(102, 126, 234, 0.08);
	}

	.logic-radio {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 2px solid #444;
		flex-shrink: 0;
		transition: all 0.15s;
		position: relative;
	}

	.logic-radio.checked {
		border-color: #667eea;
	}

	.logic-radio.checked::after {
		content: '';
		position: absolute;
		top: 3px;
		left: 3px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #667eea;
	}

	.logic-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.logic-name {
		font-size: 14px;
		font-weight: 500;
	}

	.logic-id {
		font-size: 12px;
		color: #666;
		font-family: 'SF Mono', 'Fira Code', monospace;
	}

	.logic-desc {
		font-size: 12px;
		color: #666;
	}
</style>

