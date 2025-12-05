<template>
  <div class="card-page-container">
    <div class="card-page-wrapper">
      <!-- Header -->
      <div class="text-center">
        <h1 class="page-title">SCHOOL LOGIN</h1>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="card-container-form">
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

          <!-- Password Field -->
          <div>
            <label for="password" class="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              class="input-field"
              placeholder="Enter your password"
            />
          </div>

          <!-- Remember Me -->
          <div class="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              class="checkbox-field"
            />
            <label for="remember" class="form-checkbox-label">
              Remember Me
            </label>
          </div>
        </div>

        <!-- Error Message -->
        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <!-- Buttons -->
        <div class="button-container-2">
          <button
            type="submit"
            class="button-submit"
          >
            Login
          </button>
          <router-link
            to="/reset-password"
            class="button-common"
          >
            Forgot Password
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  //
</script>