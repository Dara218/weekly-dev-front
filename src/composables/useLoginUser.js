import useVuelidate from "@vuelidate/core";
import { computed, ref } from "vue";
import { requiredField } from "./useValidationRules";
import { useAuthStore } from "@/stores/useAuthStore";
import router from "@/router";
import { USER_ROLE } from "@/constants/userRole";

/**
 * Composable function for handling user login functionality.
 * 
 * Provides form validation, login submission, and error handling for the login form.
 * Uses Vuelidate for form validation and the auth store for authentication.
 * 
 * @param {import('vue').Reactive<{
 *   email: string,
 *   password: string,
 * }>} form - Reactive form object containing login credentials
 * 
 * @returns {{
 *   login: () => Promise<void>,
 *   errorMessage: import('vue').Ref<string>,
 *   v$: import('@vuelidate/core').UseVuelidateReturn
 * }}
 */
export const useLoginUser = (form) => {
  const isButtonSubmitted = ref(false);
  const errorMessage = ref('');

  const rules = computed(() => {
    return {
      email: { required: requiredField('Email Address')},
      password: { required: requiredField('Password') },
    };
  });
  const v$ = useVuelidate(rules, form);

  const login = async () => {
    // Disable button
    isButtonSubmitted.value = true;
    
    const isFormValidated = await v$.value.$validate();

    if (!isFormValidated) {
      isButtonSubmitted.value = false;
  
      return;
    };

    try {
      const auth = useAuthStore();

      await auth.login({ ...form });

      // Set redirection
      checkUserRole(auth.user.role);
    } catch (error) {
      form.password = null;
      v$.value.password.$reset();
      isButtonSubmitted.value = false;

      errorMessage.value = error.message;
    }
  };

  const checkUserRole = (role) => {
    switch (role) {
      case USER_ROLE.STUDENT:
        router.push('/student/dashboard');

        break;
      case USER_ROLE.ADMIN:
        router.push('admin/dashboard');

        break;
      case USER_ROLE.TEACHER:
        router.push('/teacher/dashboard');

        break;
      case USER_ROLE.PARENT:
        router.push('/student/dashboard/');

        break;
      default:
        // Logout the user
    }
  };

  return {
    login,
    errorMessage,
    v$,
    isButtonSubmitted,
  };
};
