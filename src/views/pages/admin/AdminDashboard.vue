<template>
  <div class="page-table-container">
    <!-- Page Header -->
    <div class="page-header-wrapper">
      <div class="flex-center-between">
        <h1 class="text-large-2xl">
          {{ LABEL.TEACHERS }}
        </h1>

        <button
          type="button"
          class="button-common-action"
        >
          {{ LABEL.BUTTON.ADD_TEACHER }}
        </button>
      </div>

      <!-- Filters Row -->
      <div class="row-filter-container">
        <div class="row-filter-wrapper">
          <!-- Subject -->
          <div>
            <label class="row-filter-label">{{ LABEL.SUBJECT }}</label>
            <div class="filter-field-wrapper">
              <select class="selectbox-field" v-model="filters.subject_id" @change="handleGetTeachers">
                <option :value="null" disabled>{{ LABEL.SELECT_BOX.SELECT_SUBJECT }}</option>
                <option v-for="subject in subjects"
                  :key="subject.id"
                  :value="subject.id">
                    {{ subject.subject_name }}
                </option>
              </select>

              <span class="filter-clear-icon">
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
              <select class="selectbox-field" v-model="filters.status" @change="handleGetTeachers">
                <option value="3" disabled>{{ LABEL.SELECT_BOX.SELECT_STATUS }}</option>
                <option
                  v-for="option in LABEL.OPTIONS.STATUS"
                  :key="option.value"
                  :value="option.value">
                    {{ option.label }}
                </option>
              </select>

              <span class="filter-clear-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </div>
          </div>

          <!-- Search -->
          <div>
            <label class="row-filter-label">Search</label>
            <div class="filter-field-wrapper sm:w-96">
              <input
                v-model="filters.search"
                @input="debounceSearch"
                type="text"
                :placeholder="LABEL.PLACEHOLDER.SEARCH_BY_NAME_OR_EMPLOYEE_NO"
                class="selectbox-field"
              />

              <span class="filter-clear-icon">
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
        >
          {{ LABEL.BUTTON.CLEAR_ALL }}
        </button>

        <button
          type="button"
          class="confirmation-modal__confirm cursor-pointer"
        >
          {{ LABEL.BUTTON.DELETE_SELECTED }}
        </button>
      </div>

      <!-- Table -->
      <div class="table-container">
        <div class="overflow-x-auto">
          <table class="table-wrapper">
            <thead class="bg-gray-50">
              <tr>
                <th class="table-head">
                  <input
                    type="checkbox"
                    class="checkbox-field"
                  />
                </th>

                <th class="table-head">{{ LABEL.EMPLOYEE_NO }}</th>
                <th class="table-head">{{ LABEL.NAME }}</th>
                <th class="table-head">{{ LABEL.SUBJECT }}</th>
                <th class="table-head">{{ LABEL.PHONE }}</th>
                <th class="table-head">{{ LABEL.HIRE_DATE }}</th>
                <th class="table-head">{{ LABEL.STATUS }}</th>
                <th class="table-head px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody class="table-body">
              <tr v-for="teacher in teachers" :key="teacher.id">
                <!-- Checkbox -->
                <td class="common-table-data">
                  <input
                    type="checkbox"
                    class="checkbox-field"
                  />
                </td>

                <!-- Employee No -->
                <td class="common-table-data text-sm text-gray-900">
                  {{ teacher.employee_code }}
                </td>

                <!-- Name -->
                <td class="common-table-data text-sm text-gray-900">
                  {{ `${teacher.user.first_name} ${teacher.user.middle_name ?? ''} ${teacher.user.last_name}` }}
                </td>

                <!-- Subject -->
                <td class="common-table-data text-sm text-gray-900">
                  {{ teacher.specialization }}
                </td>

                <!-- Phone -->
                <td class="common-table-data text-sm text-gray-900">
                  {{ teacher.phone }}
                </td>

                <!-- Hire Date -->
                <td class="common-table-data text-sm text-gray-900">
                  {{ teacher.created_at?.slice(0, 10) }}
                  <!-- Todo: make this reusable -->
                </td>

                <!-- Status -->
                <td class="common-table-data">
                  <span class="active-text">
                    {{ getStudentStatusOption(teacher.user.is_active) }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="common-table-data text-sm">
                  <div class="inline-flex gap-2">
                    <button
                      type="button"
                      class="link-blue cursor-pointer text-xs"
                    >
                      {{ LABEL.BUTTON.VIEW_PROFILE }}
                    </button>

                    <button
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, reactive } from 'vue';
  import { debounce } from 'lodash';
  import { getStudentStatusOption } from '@/utils/commonOptionUtils';
  import { getTeachers } from '@/services/teacher/getTeachersService';
  import { LABEL } from '@/constants/label';
  import { MESSAGE } from '@/constants/message';
  import { TIMING } from '@/constants/timing';

  const teachers = ref([]);
  const subjects = ref([]);
  const filters = reactive({
    subject_id: null,
    status: 1,
    search: null,
  });

  /**
   * Run methods before the page loads.
  */
  onMounted(async () => {
    await handleGetTeachers()
  });

  /**
   * Fetches the filtered list of students from the API based on
   * the current searchKeywords. Manages loading and search state.
   *
   * Called when filters change or when the user types in the search box
   * (through the debounced wrapper).
   */
  const handleGetTeachers = async () => {
    try {
      const response = await getTeachers(filters);

      if (!response.data.success) return;

      teachers.value = response.data.data.teachers;
      subjects.value = response.data.data.subjects;
    } catch (error) {
      throw new Error(error.response?.data?.message || MESSAGE.ERROR.ERROR_FETCHING_DATA);
    }
  }

  /**
   * Debounced version of search that delays the API call
   * while the user is still typing in the search input.
   */
  const debounceSearch = debounce(handleGetTeachers, TIMING.DEBOUNCE); // 300ms
</script>
