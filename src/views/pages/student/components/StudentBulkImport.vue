<template>
  <div class="modal-overlay">
    <div class="bulk-import-modal__container">
      <div class="modal-header flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">{{ LABEL.BULK_IMPORT_PREVIEW }}</h2>
        <button @click="closeModal" class="bulk-import-modal__close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="bulk-import-modal__body">
        <div class="bulk-import-box">
          <div class="bulk-import-box__text">
            <p class="bulk-import-box__title">{{ LABEL.IMPORT_STUDENT_FILE }}</p>
            <p class="bulk-import-box__subtitle">{{ LABEL.NOTE.UPLOAD_CSV_PREVIEW }}</p>
            <p class="bulk-import-box__hint">{{ LABEL.NOTE.MAX_SIZE_5_MB }}</p>
          </div>
          <label class="bulk-import-box__dropzone" for="bulk-import-file">
            <input
              @change="previewStudents"
              id="bulk-import-file"
              type="file"
              class="bulk-import-box__input"
            />
            <span class="bulk-import-box__icon" aria-hidden="true">{{ LABEL.UP }}</span>
            <span class="bulk-import-box__cta">{{ LABEL.NOTE.CHOOSE_A_FILE_OR_DRAG }}</span>
            <span class="bulk-import-box__meta">{{ LABEL.NOTE.ACCEPTED_CSV_XLSX }}</span>
          </label>
        </div>
        <div class="bulk-import-modal__table">
          <table class="table-wrapper">
            <thead class="bg-gray-50">
              <tr>
                <th class="table-head">{{ LABEL.FIRST_NAME }}</th>
                <th class="table-head">{{ LABEL.MIDDLE_NAME }}</th>
                <th class="table-head">{{ LABEL.LAST_NAME }}</th>
                <th class="table-head">{{ LABEL.GENDER }}</th>
                <th class="table-head">{{ LABEL.DOB }}</th>
                <th class="table-head">{{ LABEL.CLASS_ID }}</th>
                <th class="table-head">{{ LABEL.SECTION_ID }}</th>
                <th class="table-head">{{ LABEL.ADMISSION_NO }}</th>
                <th class="table-head">{{ LABEL.PARENT_ID }}</th>
                <th class="table-head">{{ LABEL.PHONE }}</th>
                <th class="table-head">{{ LABEL.EMAIL }}</th>
                <th class="table-head">{{ LABEL.PASSWORD }}</th>
                <th class="table-head">{{ LABEL.STATUS }}</th>
                <th class="table-head">{{ LABEL.TEACHER_ID }}</th>
                <th class="table-head">{{ LABEL.ROLE }}</th>
                <th class="table-head">{{ LABEL.ADDRESS }}</th>
              </tr>
            </thead>
            <tbody class="table-body">
              <tr v-for="(row, index) in parsedRows" :key="index">
                <td class="common-table-data">{{ row.first_name }}</td>
                <td class="common-table-data">{{ row.middle_name }}</td>
                <td class="common-table-data">{{ row.last_name }}</td>
                <td class="common-table-data">{{ row.gender }}</td>
                <td class="common-table-data">{{ row.dob }}</td>
                <td class="common-table-data">{{ row.class_id }}</td>
                <td class="common-table-data">{{ row.section_id }}</td>
                <td class="common-table-data">{{ row.admission_no }}</td>
                <td class="common-table-data">{{ row.parent_id }}</td>
                <td class="common-table-data">{{ row.phone }}</td>
                <td class="common-table-data">{{ row.email }}</td>
                <td class="common-table-data">{{ row.password }}</td>
                <td class="common-table-data">{{ row.status }}</td>
                <td class="common-table-data">{{ row.teacher_id }}</td>
                <td class="common-table-data">{{ row.role }}</td>
                <td class="common-table-data">{{ row.address }}</td>
              </tr>

              <tr v-if="parsedRows.length === 0">
                <td class="common-table-data flex justify-center w-full">{{ LABEL.NO_IMPORTED_STUDENTS }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="bulk-import-modal__footer">
        <button
          @click="importStudents"
          :disabled="!hasImportedStudents"
          type="button"
          class="button-common-action"
        >
          {{ LABEL.BUTTON.IMPORT }}
        </button>
        <button @click="closeModal" class="button-modal-cancel cursor-pointer">{{ LABEL.BUTTON.CANCEL }}</button>
      </div>

      <ul v-if="errors">
        <li v-for="error in errors" :key="error">{{ error[0] }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
  import Papa from 'papaparse';
  import _ from 'lodash';
  import { LABEL } from '@/constants/label';
  import { ref } from 'vue';
  import { createUserBulk } from '@/services/user/userService';

  /**
   * Component emits.
   */
  const emit = defineEmits(['closeModal']);

  const parsedRows = ref([]);
  const parsedErrors = ref([]);
  const hasImportedStudents = ref(false);
  const errors = ref([]);
  const isImported = ref(false);

  /**
   * Toggle the modal.
   */
  const closeModal = () => emit('closeModal', isImported.value);

  /**
   * Handles the file for previewing the students.
   *
   * @param event The attached file
   */
  const previewStudents = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // Reset before parsing new file
    parsedRows.value = [];
    parsedErrors.value = [];
    hasImportedStudents.value = false;
    errors.value = [];

    Papa.parse(file, {
      header: true, // Uses first row as keys, gives objects like { first_name: 'Test', ... }
      skipEmptyLines: true,
      complete: (results) => {
        parsedRows.value = results.data;
        parsedErrors.value = results.errors;
        hasImportedStudents.value = true;

        parsedRows.value = parsedRows.value.map(row => ({
          ...row,
          dob: row.dob ? new Date(row.dob).toISOString().split('T')[0] : null,
          status: _.capitalize(row.status) === LABEL.OPTIONS.STATUS[0].label
            ? LABEL.OPTIONS.STATUS[0].value // 1
            : LABEL.OPTIONS.STATUS[1].value, // 0
        }));
      },
      error: (error) => {
        console.error('PapaParse error:', error);

        isImported.value = false;
      },
    });
  };

  /**
   * Imports the student in the backend.
   */
  const importStudents = async () => {
    hasImportedStudents.value = null;

    try {
      const payload = { rows: parsedRows.value };

      const response = await createUserBulk(payload);

      isImported.value = true;
      
      closeModal();
    } catch (error) {
      console.error(error.response.data.errors);

      isImported.value = false;

      errors.value = error.response.data.errors;
    }
  };
</script>
