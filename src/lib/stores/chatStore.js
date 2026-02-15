import { writable, get } from 'svelte/store';
import { pickRandomLogic, getLogicById } from '$lib/logics/index.js';
import { debugLogicOverride } from '$lib/stores/debugStore.js';

function pickLogic() {
	const override = get(debugLogicOverride);
	if (override) {
		const logic = getLogicById(override);
		if (logic) return logic;
	}
	return pickRandomLogic();
}

// Bootstrap the first chat with a logic
const firstLogic = pickLogic();

function createChatStore() {
	const { subscribe, set, update } = writable({
		chats: [
			{
				id: '1',
				title: 'New Chat',
				logicId: firstLogic.id,
				timestamp: new Date().toISOString(),
				messages: [
					{
						role: 'assistant',
						content: firstLogic.greeting
					}
				]
			}
		],
		activeChat: '1'
	});

	return {
		subscribe,
		addMessage: (chatId, message) => {
			update(state => {
				const newChats = state.chats.map(chat => {
					if (chat.id !== chatId) return chat;

					const newMessages = [...chat.messages, message];
					let newTitle = chat.title;

					// Auto-generate title from first user message if still default
					if (chat.title === 'New Chat' && message.role === 'user' && newMessages.length === 2) {
						newTitle = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
					}

					return { ...chat, messages: newMessages, title: newTitle };
				});

				return { ...state, chats: newChats };
			});
		},
		createNewChat: () => {
			update(state => {
				const logic = pickLogic();
				const newChat = {
					id: Date.now().toString(),
					title: 'New Chat',
					logicId: logic.id,
					timestamp: new Date().toISOString(),
					messages: [
						{
							role: 'assistant',
							content: logic.greeting
						}
					]
				};

				return {
					chats: [newChat, ...state.chats],
					activeChat: newChat.id
				};
			});
		},
		setActiveChat: (chatId) => {
			update(state => ({
				...state,
				activeChat: chatId
			}));
		},
		rewriteLastUserMessage: (chatId, newContent) => {
			update(state => {
				const newChats = state.chats.map(chat => {
					if (chat.id !== chatId) return chat;

					// Find the last user message and replace its content
					const newMessages = [...chat.messages];
					for (let i = newMessages.length - 1; i >= 0; i--) {
						if (newMessages[i].role === 'user') {
							newMessages[i] = { ...newMessages[i], content: newContent };
							break;
						}
					}

					// Update title if it was auto-generated from the old message
					let newTitle = chat.title;
					const userMsgCount = newMessages.filter(m => m.role === 'user').length;
					if (userMsgCount === 1) {
						newTitle = newContent.slice(0, 30) + (newContent.length > 30 ? '...' : '');
					}

					return { ...chat, messages: newMessages, title: newTitle };
				});

				return { ...state, chats: newChats };
			});
		},
		deleteChat: (chatId) => {
			update(state => {
				const newChats = state.chats.filter(c => c.id !== chatId);
				return {
					chats: newChats,
					activeChat: state.activeChat === chatId && newChats.length > 0
						? newChats[0].id
						: state.activeChat
				};
			});
		}
	};
}

export const chatStore = createChatStore();
