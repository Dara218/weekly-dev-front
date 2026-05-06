import { ref, computed } from "vue";

/**
 * Composable for handling student selection and modal toggles.
 *
 * @param {import('vue').Ref<Array>} students - Reactive list of students.
 *
 * @returns {{
 *   checkedStudentsId: import('vue').Ref<Array>,
 *   isAllChecked: import('vue').ComputedRef<boolean>,
 *   isDeleting: import('vue').Ref<boolean>,
 *   isOpenProfileModal: import('vue').Ref<boolean>,
 *   selectedStudent: import('vue').Ref<Object|null>,
 *   toggleRow: (studentId: number|string) => void,
 *   toggleAllCheckbox: () => void,
 *   toggleDeleteModal: (student: Object|Array) => void,
 *   toggleProfileModal: (student: Object) => void
 * }}
 */
export const useToggle = (students) => {
  const checkedStudentsId = ref([]);
  const isDeleting = ref(false);
  const isOpenProfileModal = ref(false);
  const selectedStudent = ref(null);

  const isAllChecked = computed(() =>
    students.value.length > 0 &&
    checkedStudentsId.value.length === students.value.length
  );

  /**
   * Toggle a single student checkbox.
   *
   * @param {number|string} studentId
   */
  const toggleRow = (studentId) => {
    if (!checkedStudentsId.value.includes(studentId)) {
      checkedStudentsId.value.unshift(studentId);
    } else {
      checkedStudentsId.value = checkedStudentsId.value.filter(
        id => id !== studentId
      );
    }
  };

  /**
   * Toggle all student checkboxes.
   */
  const toggleAllCheckbox = () => {
    if (isAllChecked.value) {
      checkedStudentsId.value = [];
    } else {
      checkedStudentsId.value = students.value.map(s => s.user_id);
    }
  };

  /**
   * Toggle delete modal.
   *
   * @param {Object|Array} student
   */
  const toggleDeleteModal = (student) => {
    selectedStudent.value = student;
    isDeleting.value = !isDeleting.value;
  };

  /**
   * Toggle profile modal.
   *
   * @param {Object} student
   */
  const toggleProfileModal = (student) => {
    selectedStudent.value = student;
    isOpenProfileModal.value = !isOpenProfileModal.value;
  };

  return {
    checkedStudentsId,
    isAllChecked,
    isDeleting,
    isOpenProfileModal,
    selectedStudent,
    toggleRow,
    toggleAllCheckbox,
    toggleDeleteModal,
    toggleProfileModal,
  };
};