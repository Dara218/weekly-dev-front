import {
  helpers,
  required,
} from "@vuelidate/validators";

/**
 * Required fields.
 *
 * @param {*} fieldName The field name
 *
 * @returns string
 */
export const requiredField = (fieldName) => {
  return helpers.withMessage(`${fieldName} is required.`, required);
};