<script>
	let { title, content, onClose } = $props();

	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}
</script>

<div class="modal-backdrop" onclick={handleBackdropClick}>
	<div class="modal">
		<div class="modal-header">
			<h2>{title}</h2>
			<button class="close-btn" onclick={onClose} aria-label="Close">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
				</svg>
			</button>
		</div>
		<div class="modal-content">
			{@html content}
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
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal {
		background: #1a1a1a;
		border: 1px solid #2a2a2a;
		border-radius: 16px;
		max-width: 600px;
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
		color: #ccc;
		line-height: 1.6;
	}

	.modal-content::-webkit-scrollbar {
		width: 8px;
	}

	.modal-content::-webkit-scrollbar-track {
		background: transparent;
	}

	.modal-content::-webkit-scrollbar-thumb {
		background: #2a2a2a;
		border-radius: 4px;
	}

	:global(.modal-content p) {
		margin: 0 0 16px 0;
	}

	:global(.modal-content p:last-child) {
		margin-bottom: 0;
	}

	:global(.modal-content strong) {
		color: #ececec;
	}

	@media (max-width: 768px) {
		.modal {
			width: 94%;
			max-height: 85vh;
			border-radius: 12px;
		}

		.modal-header {
			padding: 16px 16px 12px;
		}

		h2 {
			font-size: 18px;
		}

		.modal-content {
			padding: 16px;
			font-size: 14px;
		}
	}
</style>

