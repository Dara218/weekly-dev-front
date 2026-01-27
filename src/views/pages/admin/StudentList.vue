<template>
  <!-- TODO: Re-study login and display dynamic data from database -->
  <div class="page-table-container">
    <!-- Page Header -->
    <div class="page-header-wrapper">
      <div class="flex-center-between">
        <h1 class="text-large-2xl">
          {{ LABEL.HEADER.STUDENT }}
        </h1>

        <button
          type="button"
          class="button-common-action"
        >
          {{ LABEL.BUTTON.ADD_STUDENT }}
        </button>
      </div>

      <!-- Filters Row -->
      <div
        class="row-filter-container"
      >
        <div
          class="row-filter-wrapper"
        >
          <!-- Class -->
          <div>
            <label class="row-filter-label">
              {{ LABEL.CLASS }}
            </label>
            <select class="selectbox-field" v-model="searchKeywords.class" @change="search">
              <option value="0" disabled>{{ LABEL.SELECT_BOX.SELECT_CLASS }}</option>
              <option v-for="year in classes"
                :key="year.id"
                :value="year.id"
              >
                {{ year.name.replaceAll('_', ' ') }}
              </option>
            </select>
          </div>

          <!-- Section -->
          <div>
            <label class="row-filter-label">
              {{ LABEL.SECTION }}
            </label>
            <select class="selectbox-field" v-model="searchKeywords.section" @change="search">
              <option value="0" disabled>{{ LABEL.SELECT_BOX.SELECT_SECTION }}</option>
              <option v-for="section in sections"
                :key="section.id"
                :value="section.id"
              >
                  {{ section.section_name }}
              </option>
            </select>
          </div>

          <!-- Gender -->
          <div>
            <label class="row-filter-label">
              {{ LABEL.GENDER }}
            </label>
            <select class="selectbox-field" v-model="searchKeywords.gender" @change="search">
              <option value="0" disabled>{{ LABEL.SELECT_BOX.SELECT_GENDER }}</option>
              <option v-for="gender in LABEL.SELECT_BOX.OPTIONS.GENDER"
                :key="gender.value"
                :value="gender.value"
              >
                {{ gender.label }}
              </option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="row-filter-label">
              {{ LABEL.STATUS }}
            </label>
            <select class="selectbox-field" v-model="searchKeywords.status" @change="search">
              <option value="0" disabled>{{ LABEL.SELECT_BOX.SELECT_STATUS }}</option>
              <option v-for="option in LABEL.SELECT_BOX.OPTIONS.STATUS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Admission Year -->
          <div>
            <label class="row-filter-label">
              {{ LABEL.ADMISSION_YEAR }}
            </label>
            <select class="selectbox-field" v-model="searchKeywords.admission_year" @change="search">
              <option value="0" disabled>Select Year</option>
              <option v-for="admissionYear in admissionYears"
                :key="admissionYear.id"
                :value="admissionYear.name"
              >
                  {{ admissionYear.name }}
                </option>
            </select>
          </div>

          <!-- Search -->
          <div>
            <label class="row-filter-label">
              {{ LABEL.SEARCH }}
            </label>
            <input
              type="text"
              :placeholder="LABEL.PLACEHOLDER.SEARCH_BY_NAME_OR_ADMISSION_NO"
              class="selectbox-field"
              v-model="searchKeywords.name_or_admission_number_keyword"
              @input="debounceSearch"
            />
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
                  {{ LABEL.TABLE.HEADER.ADMISSION_NO }}
                </th>
                <th
                  scope="col"
                  class="table-head"
                >
                  {{ LABEL.TABLE.HEADER.NAME }}
                </th>
                <th
                  scope="col"
                  class="table-head"
                >
                  {{ LABEL.TABLE.HEADER.CLASS_AND_SECTION }}
                </th>
                <th
                  scope="col"
                  class="table-head"
                >
                  {{ LABEL.TABLE.HEADER.DOB }}
                </th>
                <th
                  scope="col"
                  class="table-head"
                >
                  {{ LABEL.TABLE.HEADER.GENDER }}
                </th>
                <th
                  scope="col"
                  class="table-head"
                >
                  {{ LABEL.TABLE.HEADER.GUARDIAN }}
                </th>
                <th
                  scope="col"
                  class="table-head"
                >
                  {{ LABEL.TABLE.HEADER.PHONE }}
                </th>
                <th
                  scope="col"
                  class="table-head"
                >
                  {{ LABEL.TABLE.HEADER.STATUS }}
                </th>
                <th
                  scope="col"
                  class="table-head px-4 py-3 "
                >
                  {{ LABEL.TABLE.HEADER.ACTIONS }}
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
                <tr v-for="student in students" :key="student.id">
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
                    {{ student.user.name }}
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
                    {{ student.parent.user.name }}
                  </td>
                  <td class="common-table-data text-sm text-gray-900">
                    {{ student.parent.phone }}
                  </td>
                  <td class="common-table-data">
                    <span class="active-text">
                      {{ student.student_status }}
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
  import { LABEL } from '@/constants/label';
  import { getStudents } from '@/services/teacher/getStudentsService';
  import { useAuthStore } from '@/stores/useAuthStore';
  import Spinner from '@/views/components/Spinner.vue';

  const isLoading = ref(false);
  const hasSearch = ref(false);

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
   * Reactive object that holds all filter and search keyword values
   * used when fetching the filtered list of students.
   */
  const searchKeywords = reactive({
    class: 0,
    section: 0,
    gender: 0,
    status: 0,
    admission_year: 0,
    name_or_admission_number_keyword: '',
  });

  /**
   * List of students returned from the API, displayed in the table.
   */
  const students = ref([]);

  // Debug
  console.log(user);

  /**
   * Fetches the filtered list of students from the API based on
   * the current searchKeywords. Manages loading and search state.
   *
   * Called when filters change or when the user types in the search box
   * (through the debounced wrapper).
   */
  const search = async () => {
    isLoading.value = true;
    hasSearch.value = true;

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
  const debounceSearch = debounce(search, 300); // 300ms
</script>