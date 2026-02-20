<template>
  <div class="page-table-container">
    <!-- Page Header -->
    <div class="page-header-wrapper">
    <!-- Success Message Banner -->
      <FlashMessage
        v-if="flashMessage && flashType"
        :message="flashMessage"
        :type="flashType"
        @close="closeFlashMessage"
      />

      <div class="flex-center-between">
        <h1 class="text-large-2xl">
          {{ LABEL.HEADER.STUDENT }}
        </h1>

        <button
          type="button"
          class="button-common-action"
          @click="toggleRegisterModal"
        >
          {{ LABEL.BUTTON.ADD_STUDENT }}
        </button>
      </div>

      <!-- Filters Row -->
      <div class="row-filter-container">
        <div class="row-filter-wrapper">

          <!-- Class -->
          <div>
            <label class="row-filter-label">{{ LABEL.CLASS }}</label>
            <div class="filter-field-wrapper">
              <select class="selectbox-field" v-model="searchKeywords.class" @change="search">
                <option value="0" disabled>{{ LABEL.SELECT_BOX.SELECT_CLASS }}</option>
                <option v-for="year in classes" :key="year.id" :value="year.id">
                  {{ year.name.replaceAll('_', ' ') }}
                </option>
              </select>
              <span class="filter-clear-icon" @click="search('class')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </div>
          </div>

          <!-- Section -->
          <div>
            <label class="row-filter-label">{{ LABEL.SECTION }}</label>
            <div class="filter-field-wrapper">
              <select class="selectbox-field" v-model="searchKeywords.section" @change="search">
                <option value="0" disabled>{{ LABEL.SELECT_BOX.SELECT_SECTION }}</option>
                <option v-for="section in sections" :key="section.id" :value="section.id">
                  {{ section.section_name }}
                </option>
              </select>
              <span class="filter-clear-icon" @click="search('section')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </div>
          </div>

          <!-- Gender -->
          <div>
            <label class="row-filter-label">{{ LABEL.GENDER }}</label>
            <div class="filter-field-wrapper">
              <select class="selectbox-field" v-model="searchKeywords.gender" @change="search">
                <option value="0" disabled>{{ LABEL.SELECT_BOX.SELECT_GENDER }}</option>
                <option v-for="gender in LABEL.OPTIONS.GENDER" :key="gender.value" :value="gender.value">
                  {{ gender.label }}
                </option>
              </select>
              <span class="filter-clear-icon" @click="search('gender')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="row-filter-label">{{ LABEL.STATUS }}</label>
            <div class="filter-field-wrapper">
              <select class="selectbox-field" v-model="searchKeywords.status" @change="search">
                <option value="3" disabled>{{ LABEL.SELECT_BOX.SELECT_STATUS }}</option>
                <option v-for="option in LABEL.OPTIONS.STATUS" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <span class="filter-clear-icon" @click="search('status')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </div>
          </div>

          <!-- Admission Year -->
          <div>
            <label class="row-filter-label">{{ LABEL.ADMISSION_YEAR }}</label>
            <div class="filter-field-wrapper">
              <select class="selectbox-field" v-model="searchKeywords.admission_year" @change="search">
                <option value="0" disabled>Select Year</option>
                <option v-for="admissionYear in admissionYears" :key="admissionYear.id" :value="admissionYear.name">
                  {{ admissionYear.name }}
                </option>
              </select>
              <span class="filter-clear-icon" @click="search('admission_year')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </div>
          </div>

          <!-- Search -->
          <div>
            <label class="row-filter-label">{{ LABEL.SEARCH }}</label>
            <div class="filter-field-wrapper">
              <input
                type="text"
                :placeholder="LABEL.PLACEHOLDER.SEARCH_BY_NAME_OR_ADMISSION_NO"
                class="selectbox-field"
                v-model="searchKeywords.name_or_admission_number_keyword"
                @input="debounceSearch"
              />
              <span class="filter-clear-icon" @click="search('name_or_admission_number_keyword')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div class="element-gap">
        <button
          type="button"
          class="button-common-action"
        >
          {{ LABEL.BUTTON.BULK_IMPORT }}
        </button>
        <button
          type="button"
          class="button-common-action"
        >
          {{ LABEL.BUTTON.BULK_UPDATE }}
        </button>
        <button
          type="button"
          class="button-common-action"
          @click="search('all')"
        >
          {{ LABEL.BUTTON.CLEAR_ALL }}
        </button>
      </div>

      <!-- Table -->
      <div class="table-container">
        <div class="overflow-x-auto">
          <table class="table-wrapper">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="table-head"
                >
                  <input
                    type="checkbox"
                    class="checkbox-field"
                  />
                </th>
                <th
                  scope="col"
                  class="table-head"
                >
                  {{ LABEL.ADMISSION_NO }}
                </th>
                <th
                  scope="col"
                  class="table-head"
                >
                  {{ LABEL.NAME }}
                </th>
                <th
                  scope="col"
                  class="table-head"
                >
                  {{ LABEL.CLASS_AND_SECTION }}
                </th>
                <th
                  scope="col"
                  class="table-head"
                >
                  {{ LABEL.DOB }}
                </th>
                <th
                  scope="col"
                  class="table-head"
                >
                  {{ LABEL.GENDER }}
                </th>
                <th
                  scope="col"
                  class="table-head"
                >
                  {{ LABEL.GUARDIAN }}
                </th>
                <th
                  scope="col"
                  class="table-head"
                >
                  {{ LABEL.PHONE }}
                </th>
                <th
                  scope="col"
                  class="table-head"
                >
                  {{ LABEL.STATUS }}
                </th>
                <th
                  scope="col"
                  class="table-head px-4 py-3 "
                >
                  {{ LABEL.ACTIONS }}
                </th>
              </tr>
            </thead>
            <tbody class="table-body">
              <tr v-if="isLoading">
                <td colspan="10" class="py-6">
                  <Spinner/>
                </td>
              </tr>

              <tr v-else-if="students.length === 0 && hasSearch">
                <td colspan="10" class="px-4 py-8 text-center text-sm text-gray-500">
                  {{ LABEL.NO_STUDENT_FOUND }}
                </td>
              </tr>

              <template v-else>
                <tr v-for="student in students" :key="student.user_id">
                  <td class="common-table-data">
                    <input
                      type="checkbox"
                      class="checkbox-field"
                    />
                  </td>
                  <td class="common-table-data text-sm text-gray-900">
                    {{ student.admission_no }}
                  </td>
                  <td class="common-table-data text-sm text-gray-900">
                    {{ `${student.user.first_name} ${student.user.middle_name} ${student.user.last_name}` }}
                  </td>
                  <td class="common-table-data text-sm text-gray-900">
                    {{ student.class.name.replaceAll('_', ' ') }} / {{ student.section.section_name }}
                  </td>
                  <td class="common-table-data text-sm text-gray-900">
                    {{ student.dob }}
                  </td>
                  <td class="common-table-data text-sm text-gray-900 lowercase first-letter:uppercase">
                    {{ student.gender }}
                  </td>
                  <td class="common-table-data text-sm text-gray-900">
                    {{ `${student.parent.user.first_name} ${student.parent.user.middle_name} ${student.parent.user.last_name}` }}
                  </td>
                  <td class="common-table-data text-sm text-gray-900">
                    {{ student.phone }}
                  </td>
                  <td class="common-table-data">
                    <span class="active-text">
                      {{ getStudentStatusOption(student.student_status) }}
                    </span>
                  </td>
                  <td class="common-table-data text-sm">
                    <div class="inline-flex gap-2">
                      <button
                        type="button"
                        class="link-blue cursor-pointer text-xs"
                      >
                        {{ LABEL.BUTTON.VIEW_PROFILE }}
                      </button>
                      <button
                        @click="toggleRegisterModal(student)"
                        type="button"
                        class="link-indigo cursor-pointer text-xs"
                      >
                        {{ LABEL.BUTTON.EDIT }}
                      </button>
                      <button
                        type="button"
                        class="link-red cursor-pointer text-xs"
                      >
                        {{ LABEL.BUTTON.DELETE }}
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- Table Footer / Bulk Actions Message Placeholder -->
        <div class="table-footer-container">
          <p class="text-xs text-gray-500">
            {{ LABEL.NOTE.SELECT_AT_LEAST_ONE_STUDENT }}
          </p>
          <!-- Placeholder for pagination (no logic yet) -->
          <div class="flex items-center space-x-1 text-xs text-gray-500">
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Toggle add student modal -->
    <StudentFormModal
      v-if="isOpenRegisterModal"
      :isOpenRegisterModal="isOpenRegisterModal"
      @closeModal="toggleRegisterModal"
      @refreshTable="search"
      @showFlashMessage="setFlashMessage"
      :admissionYears="admissionYears"
      :classes="classes"
      :sections="sections"
      :teacher_id="user.id"
      :student="selectedStudent"
    />
  </div>
</template>

<script setup>
  /**
   * StudentList page
   *
   * Renders the admin student table with filters, search, loading state,
   * and an empty state when no students match the criteria.
   */
  import { computed, reactive, ref } from 'vue';
  import { debounce } from 'lodash';
  import { getStudents } from '@/services/teacher/getStudentsService';
  import { useAuthStore } from '@/stores/useAuthStore';
  import { LABEL } from '@/constants/label';
  import { TIMING } from '@/constants/timing';
  import { CONFIG } from '@/constants/config';
  import Spinner from '@/views/components/Spinner.vue';
  import StudentFormModal from './components/StudentFormModal.vue';
  import FlashMessage from '@/views/components/FlashMessage.vue';
  import { getStudentStatusOption } from '@/composables/useCommonOption';

  const isLoading = ref(false);
  const hasSearch = ref(false);
  const isOpenRegisterModal = ref(false);
  const flashMessage = ref('');
  const flashType = ref('');

  /**
   * Auth store for the currently logged-in user.
   * Exposes the teacher data used to build class / section filters.
   */
  const auth = useAuthStore();
  const user = auth.user.teacher;

  /**
   * List of classes the teacher is assigned to.
   * Used to populate the "Class" filter options.
   */
  const classes = computed(() =>
    user.teacher_class_assignments.map(teacherAssign => teacherAssign.class)
  );

  /**
   * List of sections the teacher is assigned to.
   * Used to populate the "Section" filter options.
   */
  const sections = computed(() =>
    user.teacher_class_assignments.map(teacherAssign => teacherAssign.section)
  );

  /**
   * List of academic years from the teacher assignments.
   * Used to populate the "Admission Year" filter options.
   */
  const admissionYears = computed(() =>
    user.teacher_class_assignments.map(teacherAssign => teacherAssign.academic_year)
  );

  /**
   * Default reactive object that holds all filter and search keyword values
   * used when fetching the filtered list of students.
   */
  const defaultKeywords = {
    class: 0,
    section: 0,
    gender: 0,
    status: 3,
    admission_year: 0,
    name_or_admission_number_keyword: '',
  };

  /**
   * Reactive object that holds all filter and search keyword values
   * used when fetching the filtered list of students.
   */
  const searchKeywords = reactive({ ...defaultKeywords });

  /**
   * List of students returned from the API, displayed in the table.
   */
  const students = ref([]);

  /**
   * The selected student when editing.
   */
  const selectedStudent = ref([]);

  // Debug
  console.log(user);

  /**
   * Fetches the filtered list of students from the API based on
   * the current searchKeywords. Manages loading and search state.
   *
   * Called when filters change or when the user types in the search box
   * (through the debounced wrapper).
   */
  const search = async (field) => {
    isLoading.value = true;
    hasSearch.value = true;

    // Remove the keyword if cleared
    if (field) {
      if (field !== 'all') {
        // Clear all field
        searchKeywords[field] = defaultKeywords[field];
      } else {
        // Clear single field
        Object.assign(searchKeywords, defaultKeywords);
      };
    };

    try {
      const response = await getStudents(searchKeywords);
      students.value = response.data;

      console.log(students.value);
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Debounced version of search that delays the API call
   * while the user is still typing in the search input.
   */
  const debounceSearch = debounce(search, TIMING.DEBOUNCE); // 300ms

  /**
   * Shows the student register modal on button click.
   */
  const toggleRegisterModal = (student) => {
    selectedStudent.value = student;

    isOpenRegisterModal.value =! isOpenRegisterModal.value;
  }

  /**
   * Sets the flash message content and type.
   *
   * @param {Object} flash - Flash message payload.
   */
  const setFlashMessage = (flash) => {
    flashType.value = flash.success
      ? CONFIG.FLASH_MESSAGE_TYPE.SUCCESS
      : CONFIG.FLASH_MESSAGE_TYPE.ERROR;
    flashMessage.value = flash.message;
  };

  /**
   * Closes the flash message when "x" button is clicked.
   */
  const closeFlashMessage = () => {
    flashMessage.value = null;
    flashType.value = null;
  }
</script>
