<template>
  <div>
    <ConfirmationModal>
      <template #title>
        <p v-if="Array.isArray(props.student)" class="confirmation-modal__title">{{ LABEL.NOTE.DELETE_SELECTED_STUDENTS }}</p>
        <p v-else class="confirmation-modal__title">{{ LABEL.DELETE_STUDENT }}:
          {{ formatFullName(props.student.user.first_name, props.student.user?.middle_name, props.student.user.last_name) }}
        </p>
      </template>

      <template #body>
        <p class="confirmation-modal__message">
          {{ LABEL.NOTE.THIS_WILL_DELETE_STUDENT }}
        </p>
      </template>

      <template #validation-error v-if="hasError">
        <p class="error-message mt-2">{{ VALIDATION.ERROR_DELETING_USER }}</p>
      </template>

      <template #footer>
        <button
          @click="closeDeleteModal"
          type="button"
          class="button-modal-cancel cursor-pointer">
            {{ LABEL.BUTTON.CANCEL }}
        </button>
        <button
          @click="deleteStudent"
          :disabled="isSubmitBtnClicked"
          type="button"
          class="confirmation-modal__confirm cursor-pointer">
            {{ LABEL.BUTTON.DELETE }}
        </button>
      </template>
    </ConfirmationModal>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import ConfirmationModal from '@/views/components/ConfirmationModal.vue';
  import { formatFullName } from '@/utils/dataFormatterUtils';
  import { useDeleteUser } from '@/composables/useDeleteUser';
  import { LABEL } from '@/constants/label';
  import { VALIDATION } from '@/constants/validation';

  /**
   * Component props.
   */
  const props = defineProps({
    student: [Object, Array],
  });

  /**
   * Component emits.
   */
  const emit = defineEmits(['close', 'successDelete']);

  const hasError = ref(false);
  const isSubmitBtnClicked = ref(false);

  /**
   * Closes the delete modal.
   */
  const closeDeleteModal = () => {
    emit('close');
  };

  /**
   * Delete a student from the api.
   */
  const deleteStudent = async () => {
    const studentId = Array.isArray(props.student)
      ? props.student
      : props.student.user.id;

    try {
      isSubmitBtnClicked.value = true;
      hasError.value = false;

      const { handleDeleteUser } = useDeleteUser();
      const response = await handleDeleteUser(studentId);

      if (response.data.success) {
        emit('successDelete', response.data.message);
        closeDeleteModal();
      };
    } catch (error) {
      hasError.value = true;

      console.log(error);

      isSubmitBtnClicked.value = false;
    }
  };
</script>
