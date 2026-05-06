import { ref } from 'vue';
import { getStudents } from '@/services/teacher/getStudentsService';

/**
 * Composable for handling student search and filters.
 *
 * @param {Object} initialKeywords - Default filter values.
 *
 * @returns {{
 *   students: import('vue').Ref<Array>,
 *   isLoading: import('vue').Ref<boolean>,
 *   searchKeywords: import('vue').Ref<Object>,
 *   search: (field?: string) => Promise<void>
 * }}
 */
export const useSearchStudent = (initialKeywords) => {
  const students = ref([]);
  const isLoading = ref(false);
  const searchKeywords = ref({ ...initialKeywords });

  /**
   * Fetch students based on filters.
   * Optionally reset one field or all fields before searching.
   *
   * @param {string} [field]
   */
  const search = async (field) => {
    if (field) {
      if (field !== 'all') {
        searchKeywords.value[field] = initialKeywords[field];
      } else {
        Object.assign(searchKeywords.value, initialKeywords);
      }
    }

    isLoading.value = true;

    try {
      const response = await getStudents(searchKeywords.value);
      students.value = response.data;
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    students,
    isLoading,
    searchKeywords,
    search,
  };
};