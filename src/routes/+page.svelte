<script>
	import ChatInterface from '$lib/components/ChatInterface.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { getMenuContent } from '$lib/data/menuContent.js';

	let showModal = $state(false);
	let modalContent = $state({ title: '', content: '' });

	function handleMenuItemClick(itemId) {
		modalContent = getMenuContent(itemId);
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}
</script>

<svelte:head>
	<title>Fairy - Your Efficient AI Assistant</title>
</svelte:head>

<main>
	<Sidebar onMenuItemClick={handleMenuItemClick} />
	<ChatInterface />
	{#if showModal}
		<Modal title={modalContent.title} content={modalContent.content} onClose={closeModal} />
	{/if}
</main>

<style>
	:global(*, *::before, *::after) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
			'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
			sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background: #0d0d0d;
		color: #ececec;
		overflow: hidden;
		/* Support safe areas on notched phones */
		padding-top: env(safe-area-inset-top);
		padding-bottom: env(safe-area-inset-bottom);
		padding-left: env(safe-area-inset-left);
		padding-right: env(safe-area-inset-right);
	}

	main {
		display: flex;
		height: 100vh;
		height: 100dvh; /* dynamic viewport height — accounts for mobile address bars */
		width: 100%;
		overflow: hidden;
	}
</style>

