<template>
  <!-- Navbar -->
  <div v-if="isAuthenticated">
    <Navbar />
  </div>

  <RouterView :class="isAuthenticated ? 'sm:mt-14 mt-20' : ''"/>
</template>

<script setup>
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from './stores/useAuthStore';
  import Navbar from './views/components/Navbar.vue';

  const auth = useAuthStore();
  const { isAuthenticated } = storeToRefs(auth);
</script>