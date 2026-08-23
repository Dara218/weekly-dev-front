<template>
  <div :class="`banner-${props.type}`">
    <div class="banner-content">
      <svg :class="`banner-icon-${props.type}`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <p :class="`banner-text-${props.type}`">{{ props.message }}</p>
    </div>
    <button :class="`banner-close-${props.type}`" class="cursor-pointer" @click="close">
      <svg class="banner-close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup>
  /**
   * Component props.
   */
  const props = defineProps({
    message: String,
    type: String,
  });

  /**
   * Component emits.
   */
  const emit = defineEmits('close');

  const close = () => emit('close');
</script>