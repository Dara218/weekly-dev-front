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
              <select class="selectbox-field">
                <option selected>{{ LABEL.SELECT_BOX.SELECT_SUBJECT }}</option>
                <option>Grade 1</option>
                <option>Grade 2</option>
                <option>Grade 3</option>
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
              <select class="selectbox-field">
                <option value="3" disabled>{{ LABEL.SELECT_BOX.SELECT_STATUS }}</option>
                <option v-for="option in LABEL.OPTIONS.STATUS" :key="option.value" :value="option.value">
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
              <tr>
                <!-- Checkbox -->
                <td class="common-table-data">
                  <input
                    type="checkbox"
                    class="checkbox-field"
                  />
                </td>

                <!-- Employee No -->
                <td class="common-table-data text-sm text-gray-900">
                  EMP001
                </td>

                <!-- Name -->
                <td class="common-table-data text-sm text-gray-900">
                  John Michael Doe
                </td>

                <!-- Subject -->
                <td class="common-table-data text-sm text-gray-900">
                  Mathematics
                </td>

                <!-- Phone -->
                <td class="common-table-data text-sm text-gray-900">
                  +63 9123456789
                </td>

                <!-- Hire Date -->
                <td class="common-table-data text-sm text-gray-900">
                  2022-06-15
                </td>

                <!-- Status -->
                <td class="common-table-data">
                  <span class="active-text">
                    Active
                  </span>
                </td>

                <!-- Actions -->
                <td class="common-table-data text-sm">
                  <div class="inline-flex gap-2">
                    <button
                      type="button"
                      class="link-blue cursor-pointer text-xs"
                    >
                      View Profile
                    </button>

                    <button
                      type="button"
                      class="link-indigo cursor-pointer text-xs"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      class="link-red cursor-pointer text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>

              <tr>
                <!-- Checkbox -->
                <td class="common-table-data">
                  <input
                    type="checkbox"
                    class="checkbox-field"
                  />
                </td>

                <!-- Employee No -->
                <td class="common-table-data text-sm text-gray-900">
                  EMP002
                </td>

                <!-- Name -->
                <td class="common-table-data text-sm text-gray-900">
                  Jane Smith
                </td>

                <!-- Subject -->
                <td class="common-table-data text-sm text-gray-900">
                  Science
                </td>

                <!-- Phone -->
                <td class="common-table-data text-sm text-gray-900">
                  +63 9876543210
                </td>

                <!-- Hire Date -->
                <td class="common-table-data text-sm text-gray-900">
                  2021-08-10
                </td>

                <!-- Status -->
                <td class="common-table-data">
                  <span class="active-text">
                    Active
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
  import { LABEL } from '@/constants/label';

  //
</script>
