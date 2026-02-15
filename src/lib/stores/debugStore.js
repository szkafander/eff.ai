import { writable } from 'svelte/store';

/**
 * Stores the logic override ID.
 * null = random (default behavior), string = force that logic for all new chats.
 */
export const debugLogicOverride = writable(null);

