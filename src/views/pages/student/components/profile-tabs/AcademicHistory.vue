<template>
  <div class="table-container p-4 space-y-4">
    <h3 class="academic-history__title">{{ LABEL.ACADEMIC_HISTORY }}</h3>

    <ul class="academic-history__list">
      <li
        v-for="sectionEnrollment in props.student.section_enrollments"
        :key="sectionEnrollment.id"
        class="academic-history__item"
      >
        <div class="academic-history__row">
          <div class="academic-history__cell">
            <div class="academic-history__label">{{ LABEL.ACADEMIC_YEAR }}</div>
            <div class="academic-history__value">{{ sectionEnrollment.academic_year.name }}</div>
          </div>
          <div class="academic-history__cell">
            <div class="academic-history__label">{{ LABEL.STATUS }}</div>
            <div class="academic-history__value">{{ sectionEnrollment.status }}</div>
          </div>
        </div>

        <div class="academic-history__row">
          <div class="academic-history__cell">
            <div class="academic-history__label">{{ LABEL.CLASS }}</div>
            <div class="academic-history__value">{{ sectionEnrollment.section.class.name }}</div>
          </div>
          <div class="academic-history__cell">
            <div class="academic-history__label">{{ LABEL.SECTION }}</div>
            <div class="academic-history__value">{{ sectionEnrollment.section.section_name }}</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { LABEL } from '@/constants/label';

  /**
   * Component props.
   */
  const props = defineProps({
    student: Object,
  });
</script>
