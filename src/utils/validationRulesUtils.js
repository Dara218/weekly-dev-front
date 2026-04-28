import {
  email,
  helpers,
  maxLength,
  required,
  requiredIf,
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

/**
 * Required fields.
 *
 * @param {*} fieldName The field name
 *
 * @returns string
 */
export const requiredIfEnteredField = (fieldName) => {
  return helpers.withMessage(`${fieldName} is required.`, requiredIf);
};

/**
 * Maximum length field.
 *
 * @param {*} fieldName The field name
 *
 * @returns string
 */
export const maxLengthField = (fieldName, maxValue) => {
  return helpers.withMessage(`${fieldName} must not exceed ${maxValue} characters.`, maxLength(maxValue));
}

/**
 * Validates if a value is in the provided options array.
 *
 * @param {string} fieldName The field name
 * @param {Array|Object} options Array of valid options or ref containing array
 *
 * @returns {Function} Validation function
 */
export const inOptions = (fieldName, options) => {
  return helpers.withMessage(
    `${fieldName} is invalid.`,
    value => {
      const values = Array.isArray(options)
        ? options
        : options.value;

      return values.some(option => String(option) === String(value));
    },
  );
}

/**
 * Validates if the value is a valid date.
 *
 * @param {string} fieldName The field name
 *
 * @returns {Function} Validation function
 */
export const validDate = (fieldName) => {
  return helpers.withMessage(
    `${fieldName} must be a valid date`,
    value => !isNaN(Date.parse(value)) // If not invalid number/date
  );
}

/**
 * Validates Philippine phone number format.
 * Accepts formats: 09XXXXXXXXX or +639XXXXXXXXX
 *
 * @param {string} fieldName The field name
 *
 * @returns {Function} Validation function
 */
export const phoneField = (fieldName) => {
  return helpers.withMessage(
    `Please enter a valid ${fieldName}.`,
    value => {
      if (!value) return true; // Skip if empty

      return /^(09\d{9}|\+639\d{9})$/.test(value); // +63
    }
  );
}

/**
 * Email validation field.
 *
 * @returns string
 */
export const emailField = (fieldName) => helpers.withMessage(`Enter a valid ${fieldName}`, email);

/**
 * Password validation field.
 * Requires at least 8 characters with uppercase, lowercase, number, and special character.
 *
 * @param {string} fieldName The field name
 * @param {number} minLength Minimum password length (default: 8)
 *
 * @returns {Function} Validation function
 */
export const passwordField = (fieldName, minLength = 8) => {
  return helpers.withMessage(
    `${fieldName} must be at least ${minLength} characters long and include uppercase, lowercase, number, and special character.`,
    value => {
      if (!value) return true;

      // Allow any non-alphanumeric character as special character
      const regex = new RegExp(
        `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{${minLength},}$`
      );
      
      return regex.test(value);
    },
  );
};