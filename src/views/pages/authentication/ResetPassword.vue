<template>
  <div class="card-page-container">
    <div class="card-page-wrapper">
      <!-- Header -->
      <div class="text-center">
        <h1 class="page-title">FORGOT PASSWORD</h1>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleResetRequest" class="card-container-form">
        <div class="space-y-4">
          <!-- Email Field -->
          <div>
            <label for="email" class="form-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              class="input-field"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <!-- Success Message -->
        <p v-if="successMessage" class="success-message">
          {{ successMessage }}
        </p>

        <!-- Buttons -->
        <div class="button-container-2">
          <button
            type="submit"
            class="button-submit"
          >
            Send Reset Link
          </button>
          <router-link
            to="/login"
            class="button-common"
          >
            Back to Login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  // 
</script>