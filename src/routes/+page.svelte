<script>
	import ChatInterface from '$lib/components/ChatInterface.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import DebugModal from '$lib/components/DebugModal.svelte';
	import { getMenuContent } from '$lib/data/menuContent.js';

	let showModal = $state(false);
	let showDebug = $state(false);
	let modalContent = $state({ title: '', content: '' });

	function handleMenuItemClick(itemId) {
		if (itemId === 'debug') {
			showDebug = true;
			return;
		}
		modalContent = getMenuContent(itemId);
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	function closeDebug() {
		showDebug = false;
	}
</script>

<svelte:head>
	<title>Fairy - Your Friendly AI Assistant</title>
</svelte:head>

<main>
	<Sidebar onMenuItemClick={handleMenuItemClick} />
	<ChatInterface />
	{#if showModal}
		<Modal title={modalContent.title} content={modalContent.content} onClose={closeModal} />
	{/if}
	{#if showDebug}
		<DebugModal onClose={closeDebug} />
	{/if}
</main>

<style>
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
	}

	main {
		display: flex;
		height: 100vh;
		width: 100%;
	}
</style>

