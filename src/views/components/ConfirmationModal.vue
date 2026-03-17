<template>
  <div class="confirmation-modal">
    <div class="confirmation-modal__container">

      <div class="confirmation-modal__header">
        <div class="confirmation-modal__icon" aria-hidden="true">!</div>
        <div>
          <!-- Slot: title -->
          <slot name="title">
            <p class="confirmation-modal__title">{{ LABEL.CONFIRM_ACTION }}</p>
          </slot>

          <!-- Slot: subtitle -->
          <slot name="subtitle">
            <p class="confirmation-modal__subtitle">{{ LABEL.NOTE.PLEASE_CONFIRM_BEFORE_PROCEEDING }}</p>
          </slot>
        </div>
      </div>

      <div class="confirmation-modal__body">
        <!-- Slot: body -->
        <slot name="body">
          <p class="confirmation-modal__message">
            {{ LABEL.ACTION_CANNOT_BE_UNDONE }}
          </p>
        </slot>

        <slot name="validation-error">
          <!-- Validation error -->
        </slot>
      </div>

      <div class="confirmation-modal__footer">
        <!-- Slot: footer -->
        <slot name="footer">
          <button type="button" class="button-modal-cancel">{{ LABEL.BUTTON.CANCEL }}</button>
          <button type="button" class="confirmation-modal__confirm">{{ LABEL.BUTTON.CONFIRM }}</button>
        </slot>
      </div>

    </div>
  </div>
</template>

<script setup>
  import { LABEL } from '@/constants/label';
</script>