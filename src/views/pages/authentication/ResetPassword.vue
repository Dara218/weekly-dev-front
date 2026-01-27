<template>
  <div class="card-page-container">
    <div class="card-page-wrapper">
      <!-- Header -->
      <div class="text-center">
        <h1 class="page-title">{{ LABEL.HEADER.FORGOT_PASSWORD }}</h1>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleResetRequest" class="card-container-form">
        <div class="space-y-4">
          <!-- Email Field -->
          <div>
            <label for="email" class="form-label">
              {{ LABEL.EMAIL }}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              class="input-field"
              :placeholder="LABEL.PLACEHOLDER.EMAIL"
            />
          </div>
        </div>

        <!-- Success Message -->
        <!-- <p v-if="successMessage" class="success-message">
          {{ successMessage }}
        </p> -->

        <!-- Buttons -->
        <div class="button-container-2">
          <button
            type="submit"
            class="button-submit"
          >
            {{ LABEL.BUTTON.PASSWORD_RESET_LINK }}
          </button>
          <router-link
            to="/login"
            class="button-common-navigation"
          >
            {{ LABEL.BUTTON.BACK_TO_LOGIN }}
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { LABEL } from '@/constants/label';

  //
</script>