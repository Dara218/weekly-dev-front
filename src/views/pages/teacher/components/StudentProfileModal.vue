<template>
  <div class="modal-overlay" @mousedown.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <div class="flex items-center justify-between">
          <h2 class="text-large-xl"><span class="font-bold">{{ LABEL.STUDENT_PROFILE }}:</span>
            {{ formatFullName(props.student.user.first_name, props.student.user.middle_name, props.student.user.last_name) }}
          </h2>
          <span class="active-text">Active</span>
        </div>
      </div>

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
            <button class="button-common-action" type="button">{{ LABEL.BUTTON.UPLOAD_DOCUMENT }}</button>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <div class="flex gap-2">
          <button @click="openEditModal" class="button-common-navigation" type="button">{{ LABEL.BUTTON.EDIT }}</button>
          <button class="button-modal-save" type="button">{{ LABEL.BUTTON.SAVE }}</button>
          <button class="button-common-navigation" type="button" @click="closeModal">{{ LABEL.BUTTON.CANCEL }}</button>
        </div>
        <!-- <button class="button-common-action" type="button">Promote Student</button> -->
      </div>
    </div>
  </div>
</template>

<script setup>
  import { shallowRef } from 'vue';
  import { isCommonModalField } from '@/composables/useModal';
  import { formatFullName } from '@/composables/useDataFormatter';
  import Overview from '../../student/components/profile-tabs/Overview.vue';
  import AcademicHistory from '../../student/components/profile-tabs/AcademicHistory.vue';
  import Attendance from '../../student/components/profile-tabs/Attendance.vue';
  import Exams from '../../student/components/profile-tabs/Exams.vue';
  import Fees from '../../student/components/profile-tabs/Fees.vue';
  import Documents from '../../student/components/profile-tabs/Documents.vue';
  import Timeline from '../../student/components/profile-tabs/Timeline.vue';
  import Health from '../../student/components/profile-tabs/Health.vue';
  import { LABEL } from '@/constants/label';

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

  // Debug
  console.log(props.student);

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
  ]

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
</script>