/**
 * Formats first, middle, and last name into a full name.
 *
 * @param {string} firstName - First name of the user.
 * @param {string} middleName - Middle name of the user.
 * @param {string} lastName - Last name of the user.
 *
 * @returns {string} Full name in "first middle last" format.
 */
export const formatFullName = (firstName, middleName, lastName) => `${firstName} ${middleName} ${lastName}`;