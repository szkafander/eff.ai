<script>
	import { chatStore } from '$lib/stores/chatStore.js';
	
	let { onMenuItemClick } = $props();
	
	let chats = $derived($chatStore.chats);
	let activeChat = $derived($chatStore.activeChat);
	let isSidebarOpen = $state(typeof window !== 'undefined' ? window.innerWidth > 768 : true);

	function handleNewChat() {
		chatStore.createNewChat();
	}

	function handleChatClick(chatId) {
		chatStore.setActiveChat(chatId);
		// Auto-close sidebar on mobile after selecting a chat
		if (window.innerWidth <= 768) {
			isSidebarOpen = false;
		}
	}

	function handleDeleteChat(chatId, event) {
		event.stopPropagation();
		if (chats.length > 1) {
			chatStore.deleteChat(chatId);
		}
	}

	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}

	const menuItems = [
		{ id: 'about-fairy', label: 'About Fairy', icon: '✨' },
		{ id: 'energy-use', label: 'On LLM Energy Use', icon: '⚡' },
		{ id: 'ai-effects', label: 'The Societal Effects of AI', icon: '🌍' },
		{ id: 'about-us', label: 'About Us', icon: '👥' }
	];
</script>

<button class="sidebar-toggle" class:sidebar-open={isSidebarOpen} onclick={toggleSidebar} aria-label="Toggle sidebar">
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
		<path d="M3 12h18M3 6h18M3 18h18" stroke-width="2" stroke-linecap="round"/>
	</svg>
</button>

{#if isSidebarOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="sidebar-backdrop" onclick={() => isSidebarOpen = false}></div>
{/if}

<aside class="sidebar" class:collapsed={!isSidebarOpen}>
	<div class="sidebar-header">
		<button class="new-chat-btn" onclick={handleNewChat}>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round"/>
			</svg>
			<span>New Chat</span>
		</button>
	</div>

	<div class="chat-list">
		{#each chats as chat (chat.id)}
			<button
				class="chat-item"
				class:active={chat.id === activeChat}
				onclick={() => handleChatClick(chat.id)}
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				<span class="chat-title">{chat.title}</span>
				{#if chats.length > 1}
					<button
						class="delete-btn"
						onclick={(e) => handleDeleteChat(chat.id, e)}
						aria-label="Delete chat"
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
						</svg>
					</button>
				{/if}
			</button>
		{/each}
	</div>

	<div class="sidebar-footer">
		<div class="menu-items">
			{#each menuItems as item (item.id)}
				<button class="menu-item" onclick={() => onMenuItemClick(item.id)}>
					<span class="menu-icon">{item.icon}</span>
					<span class="menu-label">{item.label}</span>
				</button>
			{/each}
		</div>
	</div>
</aside>

<style>
	.sidebar-toggle {
		position: fixed;
		top: calc(env(safe-area-inset-top, 0px) + 8px);
		left: 12px;
		z-index: 100;
		background: #1a1a1a;
		border: 1px solid #2a2a2a;
		border-radius: 8px;
		padding: 8px;
		color: #ececec;
		cursor: pointer;
		display: none;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}

	.sidebar-toggle:hover {
		background: #2a2a2a;
	}

	.sidebar-backdrop {
		display: none;
	}

	.sidebar {
		width: 260px;
		height: 100vh;
		height: 100dvh;
		background: #0d0d0d;
		border-right: 1px solid #2a2a2a;
		display: flex;
		flex-direction: column;
		transition: transform 0.3s ease;
		position: relative;
		z-index: 10;
		flex-shrink: 0;
	}

	.sidebar.collapsed {
		transform: translateX(-100%);
	}

	.sidebar-header {
		padding: 16px;
		border-bottom: 1px solid #2a2a2a;
	}

	.new-chat-btn {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: transparent;
		border: 1px solid #2a2a2a;
		border-radius: 8px;
		color: #ececec;
		font-size: 14px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.new-chat-btn:hover {
		background: #1a1a1a;
	}

	.chat-list {
		flex: 1;
		overflow-y: auto;
		padding: 8px;
		-webkit-overflow-scrolling: touch;
	}

	.chat-list::-webkit-scrollbar {
		width: 6px;
	}

	.chat-list::-webkit-scrollbar-track {
		background: transparent;
	}

	.chat-list::-webkit-scrollbar-thumb {
		background: #2a2a2a;
		border-radius: 3px;
	}

	.chat-item {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 12px;
		background: transparent;
		border: none;
		border-radius: 8px;
		color: #ececec;
		font-size: 14px;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
		margin-bottom: 4px;
		position: relative;
	}

	.chat-item:hover {
		background: #1a1a1a;
	}

	.chat-item.active {
		background: #2a2a2a;
	}

	.chat-title {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.delete-btn {
		opacity: 0;
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

	.chat-item:hover .delete-btn {
		opacity: 1;
	}

	.delete-btn:hover {
		color: #ff4444;
		background: rgba(255, 68, 68, 0.1);
	}

	.sidebar-footer {
		border-top: 1px solid #2a2a2a;
		padding: 16px 8px;
	}

	.menu-items {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.menu-item {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 12px;
		background: transparent;
		border: none;
		border-radius: 8px;
		color: #ececec;
		font-size: 14px;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}

	.menu-item:hover {
		background: #1a1a1a;
	}

	.menu-icon {
		font-size: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
	}

	.menu-label {
		flex: 1;
	}

	/* ── Mobile ──────────────────────────────────────── */

	@media (max-width: 768px) {
		.sidebar-toggle {
			display: flex;
		}

		.sidebar-backdrop {
			display: block;
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.6);
			z-index: 40;
			animation: backdropFade 0.2s ease-out;
		}

		@keyframes backdropFade {
			from { opacity: 0; }
			to { opacity: 1; }
		}

		.sidebar {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 50;
			box-shadow: 4px 0 16px rgba(0, 0, 0, 0.5);
			width: min(280px, 85vw);
		}

		.sidebar.collapsed {
			transform: translateX(-100%);
		}

		/* On mobile, always show delete button (no hover) */
		.delete-btn {
			opacity: 0.7;
		}

		.sidebar-header {
			padding: calc(env(safe-area-inset-top, 0px) + 56px) 14px 14px 14px;
		}

		.chat-item {
			padding: 12px;
		}

		.menu-item {
			padding: 12px;
		}
	}

	/* ── Desktop ─────────────────────────────────────── */

	@media (min-width: 769px) {
		.sidebar-toggle {
			display: none;
		}

		.sidebar.collapsed {
			transform: translateX(0);
		}
	}
</style>

