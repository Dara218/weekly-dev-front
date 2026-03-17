import { LABEL } from "@/constants/label"

/**
 * Returns the label for a student status value.
 *
 * @param {number|string} studentStatus - Student status value.
 *
 * @returns {string} Status label.
 */
export const getStudentStatusOption = (studentStatus) => {
  const statusValues = LABEL.OPTIONS.STATUS.map(option => option.value);

  return statusValues.includes(Number(studentStatus))
    ? LABEL.ACTIVE
    : LABEL.INACTIVE;
}

/**
 * Returns the list of gender values for select options.
 *
 * @returns {Array} Gender values.
 */
export const getGenderValue = () => LABEL.OPTIONS.GENDER.map(gender => gender.value);

/**
 * Returns the list of status values for select options.
 *
 * @returns {Array} Status values.
 */
export const getStatusValue = () => LABEL.OPTIONS.STATUS.map(status => status.value);
