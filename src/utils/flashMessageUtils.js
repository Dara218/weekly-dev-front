import { CONFIG } from '@/constants/config';

/**
 * Sets the flash message content and type.
 *
 * @param {Object} flash - Flash message payload.
 * @param {import('vue').Ref<string|null>} flashMessageRef - Flash message state.
 * @param {import('vue').Ref<string|null>} flashTypeRef - Flash message type state.
 *
 * @returns {void}
 */
export const setFlashMessage = (flash, flashMessageRef, flashTypeRef) => {
  flashTypeRef.value = flash.success
    ? CONFIG.FLASH_MESSAGE_TYPE.SUCCESS
    : CONFIG.FLASH_MESSAGE_TYPE.ERROR;
  flashMessageRef.value = flash.message;
};

/**
 * Resets the flash message content and type.
 *
 * @param {import('vue').Ref<string|null>} flashMessageRef - Flash message state.
 * @param {import('vue').Ref<string|null>} flashTypeRef - Flash message type state.
 *
 * @returns {void}
 */
export const closeFlashMessage = (flashMessageRef, flashTypeRef) => {
  flashMessageRef.value = null;
  flashTypeRef.value = null;
};