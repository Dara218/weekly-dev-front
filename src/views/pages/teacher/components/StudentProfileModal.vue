<template>
  <div class="modal-overlay" @mousedown.self="closeModal">
    <div class="modal-container">
    <!-- Success Message Banner -->
      <flash-message
        v-if="flashMessage && flashType"
        :message="flashMessage"
        :type="flashType"
        @close="handleCloseFlash"
      />

      <div class="modal-header">
        <div class="flex items-center justify-between">
          <h2 class="text-large-xl"><span class="font-bold">{{ LABEL.STUDENT_PROFILE }}:</span>
            {{ formatFullName(props.student.user.first_name, props.student.user.middle_name, props.student.user.last_name) }}
          </h2>
          <span class="active-text">Active</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="modal-content">
        <div class="element-gap">
          <button
            v-for="tab in tabs"
            :key="tab.label"
            @click="activeTab = tab"
            :class="activeTab === tab ? 'button-active-navigation' : 'button-common-navigation'"
            type="button"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Contents -->
        <component :is="activeTab.component" :student="props.student"/>

        <div class="table-container p-4 space-y-3">
          <div class="flex items-center justify-between">
            <div class="text-lg font-semibold text-gray-900">{{ LABEL.DOCUMENTS }}</div>
            <!-- <button class="button-common-action" type="button">{{ LABEL.BUTTON.UPLOAD_DOCUMENT }}</button> -->
            <input
              @change="selectFile"
              ref="fileInput"
              type="file"
              class="button-common-action"
            >
          </div>
        </div>

        <p v-if="userDocuments.length === 0" class="table-container p-4 space-y-3">User has no uploaded document.</p>
        <!-- Uploaded documents -->
        <ul v-else class=" -4 space-y-3">
          <li v-for="(userDocument) in userDocuments" :key="userDocument.id" class="table-container flex justify-between items-center p-4">
            <a target="_blank" :href="`${API_ENDPOINT.STORAGE_BUCKET}/${userDocument.file_path}`">
              {{ userDocument.file_path }}
            </a>
            <div class="cursor-pointer text-red-500" @click="toggleRemoveModal(userDocument.id)">X</div>
          </li>

          <button 
            v-if="hasMore"
            @click="loadDocuments"
            :disabled="isLoading"
            class="link-blue cursor-pointer text-xs">Load more...</button>
        </ul>

        <p class="error-message text-center" v-if="uploadErrorMessage">{{ uploadErrorMessage }}</p>
      </div>

      <div class="modal-footer">
        <div class="flex gap-2">
          <button
            @click="openEditModal"
            class="button-common-navigation"
            type="button">
              {{ LABEL.BUTTON.EDIT }}
            </button>

          <button
            @click="handleUpload"
            :disabled="!selectedFile || isUploading"
            class="button-modal-save"
            type="button">
              {{ LABEL.BUTTON.SAVE }}
          </button>

          <button
            @click="closeModal"
            class="button-common-navigation"
            type="button">
              {{ LABEL.BUTTON.CANCEL }}
            </button>
        </div>
        <!-- <button class="button-common-action" type="button">Promote Student</button> -->
      </div>
    </div>

    <!-- Remove document modal -->
    <ConfirmationModal v-if="isDocumentRemove">
      <template #title>
        <p class="confirmation-modal__title">Do you really want to remove this document?</p>
      </template>
      <template #footer>
        <button
          @click="toggleRemoveModal"
          type="button"
          class="button-modal-cancel cursor-pointer">
            {{ LABEL.BUTTON.CANCEL }}
        </button>
        <button
          @click="removeDocument"
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
  import { shallowRef, ref, onMounted, nextTick } from 'vue';
  import { isCommonModalField } from '@/utils/modalTogglerUtils';
  import { formatFullName } from '@/utils/dataFormatterUtils';
  import { closeFlashMessage, setFlashMessage } from '@/utils/flashMessageUtils';
  import { useUploadStudentFile } from '@/composables/useUploadFile';
  import { useGetFile } from '@/composables/useGetFile';
  import { useDeleteFile } from '@/composables/useDeleteFile';
  import Overview from '../../student/components/profile-tabs/Overview.vue';
  import AcademicHistory from '../../student/components/profile-tabs/AcademicHistory.vue';
  import Attendance from '../../student/components/profile-tabs/Attendance.vue';
  import Exams from '../../student/components/profile-tabs/Exams.vue';
  import Fees from '../../student/components/profile-tabs/Fees.vue';
  import Documents from '../../student/components/profile-tabs/Documents.vue';
  import Timeline from '../../student/components/profile-tabs/Timeline.vue';
  import Health from '../../student/components/profile-tabs/Health.vue';
  import FlashMessage from '@/views/components/FlashMessage.vue';
  import ConfirmationModal from '@/views/components/ConfirmationModal.vue';
  import { LABEL } from '@/constants/label';
  import { API_ENDPOINT } from '@/constants/endpoint';

  /**
   * Component emits.
   */
  const emit = defineEmits(['closeModal', 'openEditModal']);

  /**
   * Component props.
   */
  const props = defineProps({
    student: Object,
  });

  // Fetch file from the api/storage (if present)
  const { get } = useGetFile();

  /**
   * Run methods before the page loads.
  */
  onMounted(async () => {
    try {
      initDocuments();
    } catch (error) {
      console.error(error);
    }
  });

  /**
   * Resets the document list state to its initial values.
   *
   * Clears the currently loaded user documents and resets
   * pagination controls such as offset and hasMore flag.
   *
   * @returns {void}
   */
  const resetDocuments = () => {
    userDocuments.value = [];
    offset.value = 0;
    hasMore.value = true;
  };

  /**
   * Initializes the document list.
   *
   * Resets existing document data and fetches the first batch
   * of documents from the backend using the current pagination settings.
   *
   * @async
   *
   * @returns {Promise<void>}
   */
  const initDocuments = async () => {
    resetDocuments();
    await loadDocuments();
  };

  const userId = props.student.user.id;
  const selectedFile = ref(null);
  const selectedFileId = ref(null);
  const uploadErrorMessage = ref(null);
  const flashMessage = ref(null);
  const flashType = ref(null);
  const fileInput = ref(null);
  const userDocuments = ref([]);
  const isDocumentRemove = ref(false);
  const limit = 3;
  const offset = ref(0);
  const hasMore = ref(true);
  const isLoading = ref(false);
  const isUploading = ref(false);

  /**
   * The tabs containing the label and the component.
   */
  const tabs = [
    { label: LABEL.OVERVIEW, component: Overview },
    { label: LABEL.ACADEMIC_HISTORY, component: AcademicHistory },
    { label: LABEL.ATTENDANCE, component: Attendance },
    { label: LABEL.EXAMS, component: Exams },
    { label: LABEL.FEES, component: Fees },
    { label: LABEL.DOCUMENTS, component: Documents },
    { label: LABEL.TIMELINE, component: Timeline },
    { label: LABEL.HEALTH, component: Health },
  ];

  /**
   * The selected active tab that will be displayed.
   */
  const activeTab = shallowRef(tabs[0]);

  /**
   * Modal close handler with unsaved changes detection.
   * Prompts user if there are unsaved changes before closing.
   */
  const closeModal = () => isCommonModalField(emit);

  /**
   * Closes the student profile modal and opens the edit modal that loads the current student.
   */
  const openEditModal = () => {
    closeModal();

    emit('openEditModal', props.student);
  }

  /**
   * Sets the selected file to be uploaded.
   *
   * @param event The selected file
   */
  const selectFile = (event) => selectedFile.value = event.target.files[0];
  const { upload } = useUploadStudentFile();

  /**
   * Process the file upload to call the api.
   */
  const handleUpload = async () => {
    if (isUploading.value) return;

    try {
      isUploading.value = true;

      closeFlashMessage(flashMessage, flashType);

      const { data } = await upload(userId, selectedFile.value);

      setFlashMessage(
        {
          success: data.success,
          message: data.message
        },
        flashMessage,
        flashType,
      );

      selectedFile.value = null;
      fileInput.value.value = null;

      if (data.data) {
        userDocuments.value.unshift(data.data);
      }

      if (offset.value > 3) hasMore.value = true;

    } catch (error) {
      setFlashMessage(
        {
          success: false,
          message: error.response.data.message
        },
        flashMessage,
        flashType,
      );
    } finally {
      isUploading.value = false;
    }
  };

  /**
   * Closes the flash message when "x" button is clicked.
   */
  const handleCloseFlash = () => closeFlashMessage(flashMessage, flashType);

  /**
   * Toggle the delete file confirmation modal.
   *
   * @param fileId The file id from the database
   */
  const toggleRemoveModal = (fileId) => {
    isDocumentRemove.value =! isDocumentRemove.value

    if (fileId) selectedFileId.value = fileId;
  };

  const { deleteFile, isSubmitBtnClicked } = useDeleteFile();

  /**
   * Calls the remove file api from the backend.
   */
  const removeDocument = async () => {
    try {
      isDocumentRemove.value = false;

      const { data } = await deleteFile(selectedFileId.value);

      // Remove the document id in the user documents array
      userDocuments.value = userDocuments.value.filter(document => document.id !== selectedFileId.value);

      initDocuments();

      setFlashMessage(
        {
          success: data.success,
          message: data.message
        },
        flashMessage,
        flashType,
      );
    } catch (error) {
      setFlashMessage(
        { success: false, message: error.response?.data?.message || 'Failed to delete document.' },
        flashMessage,
        flashType,
      );

      isDocumentRemove.value = false;
    }
  }

  /**
   * Calls the get file api from the backend and show it on the modal.
   */
  const loadDocuments = async () => {
    if (!hasMore.value || isLoading.value) return;

    isLoading.value = true;

    const response = await get(userId, {
      limit,
      offset: offset.value
    });

    if (response.data.data) userDocuments.value.push(...response.data.data);

    hasMore.value = response.data.hasMore;
    offset.value += limit;

    isLoading.value = false;
  };
</script>