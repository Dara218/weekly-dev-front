import { LABEL } from "@/constants/label"

/**
 * Returns the label for a student status value.
 *
 * @param {number|string} studentStatus - Student status value.
 *
 * @returns {string} Status label.
 */
export const getUserStatusOption = (status) => Number(status) === 1 ? LABEL.ACTIVE : LABEL.INACTIVE;

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

/**
 * Converts a date string to ISO 8601 format (YYYY-MM-DD).
 *
 * @param {string} date - The date string to convert.
 *
 * @returns {string} The first 10 characters of the date string in YYYY-MM-DD format.
 */
export const convertDateToIsoFormat = (date) => date.slice(0, 10); 
