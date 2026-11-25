<template>
  <div class="p-4 space-y-3">
    <p>{{ LABEL.FEES_PAGE.PROFILE_TAB_HINT }}</p>
    <RouterLink :to="{ name: 'fees' }" class="button-common-action">
      {{ LABEL.FEES_PAGE.VIEW_SCHOOL_FEES }}
    </RouterLink>
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
