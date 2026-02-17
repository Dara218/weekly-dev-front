import { ref } from "vue";
import { MESSAGE } from "@/constants/message";
import { createUser } from "@/services/user/createUserService";
import useVuelidate from "@vuelidate/core";

/**
 * Composable for creating a user with validation and submission state.
 *
 * @param {Object} rules - Vuelidate rules for the form.
 * @param {Object} form - Reactive form object.
 * @returns {Object} Submission helpers and validation state.
 */
export const useCreateUser = (rules, form) => {
  const v$ = useVuelidate(rules, form);
  const isSubmitBtnClicked = ref(false);
  const backendValidationError = ref({});

  /**
   * Submits the form data to create a user.
   *
   * @returns {Promise<Object|false|undefined>} API response data or false if invalid.
   */
  const submit = async () => {
    isSubmitBtnClicked.value = true;
    const isFormValidated = await v$.value.$validate();

    if (!isFormValidated) {
      isSubmitBtnClicked.value = false;

      return false;
    };

    try {
      const response = await createUser({ ...form });

      isSubmitBtnClicked.value = false;

      return response.data
    } catch (error) {
      isSubmitBtnClicked.value = false;

      if (error.status === 422) {
        backendValidationError.value = error.response.data.errors;

        return;
      }

      throw new Error(error.response?.data?.message || MESSAGE.ERROR.STUDENT_CREATION_FAILED);
    }
  };

  return { isSubmitBtnClicked, submit, v$, backendValidationError };
}
