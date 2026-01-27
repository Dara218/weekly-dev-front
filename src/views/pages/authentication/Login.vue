<template>
  <div class="card-page-container">
    <div class="card-page-wrapper">
      <!-- Header -->
      <div class="text-center">
        <h1 class="page-title">{{ LABEL.HEADER.SCHOOL_LOGIN }}</h1>
      </div>

      <!-- Form -->
      <form @submit.prevent="login" class="card-container-form">
        <div class="space-y-4">
          <!-- Email Field -->
          <div>
            <label for="email" class="form-label">
              {{ LABEL.EMAIL }}
            </label>
            <input
              v-model="form.email"
              type="text"
              name="email"
              id="email"
              class="input-field"
              :placeholder="LABEL.PLACEHOLDER.EMAIL"
            />
            <p v-if="v$.email.$error" class="error-message">{{ v$.email.$errors[0].$message }}</p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="form-label">
              {{ LABEL.PASSWORD }}
            </label>
            <input
              v-model="form.password"
              type="password"
              name="password"
              id="password"
              class="input-field"
              :placeholder="LABEL.PLACEHOLDER.PASSWORD"
            />
            <p v-if="v$.password.$error" class="error-message">{{ v$.password.$errors[0].$message }}</p>
          </div>
        </div>

        <!-- Error Message -->
        <p v-if="errorMessage" class="error-message text-center!">
          {{ errorMessage }}
        </p>

        <!-- Buttons -->
        <div class="button-container-2">
          <button
            type="submit"
            class="button-submit"
            :disabled="isButtonSubmitted"
          >
            {{ LABEL.BUTTON.LOGIN }}
          </button>
          <router-link
            to="/reset-password"
            class="button-common-navigation"
          >
            {{ LABEL.BUTTON.FORGOT_PASSWORD }}
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { useLoginUser } from '@/composables/useLoginUser';
  import { LABEL } from '@/constants/label';
  import { reactive } from 'vue';

  const form = reactive({
    email: '',
    password: '',
  })

  const { login, v$, errorMessage, isButtonSubmitted } = useLoginUser(form);
</script>