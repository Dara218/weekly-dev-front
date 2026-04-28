import { LABEL } from "@/constants/label";
import { isEqual } from "lodash";

/**
 * Provides a close handler that confirms on unsaved changes.
 *
 * @param {Object} form - Reactive form data.
 * @param {Object} initialForm - Initial form snapshot for comparison.
 * @param {Function} emit - Vue emit function.
 *
 * @returns {Object} Close handler.
 */
export const isModalFieldChanged = (form, initialForm, emit) => {
    /**
     * Closes the modal with unsaved changes confirmation.
     */
    const closeModal = () => {
      if (!isEqual(form, initialForm)) {
        const isConfirm = confirm(LABEL.MESSAGE.UNSAVED_CHANGES);

        if (!isConfirm) return;
      };

      emit('closeModal');
    };

    return { closeModal };
}

/**
 * Provides a close handler .
 *
 * @param {Function} emit - Vue emit function.
 *
 * @returns {Object} Close handler.
 */
export const isCommonModalField = (emit) => emit('closeModal');