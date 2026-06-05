<template>
  <div class="modal-overlay" @mousedown.self="closeModal">
    <div class="modal-container">
      <!-- Header -->
      <div class="modal-header">
        <h2 class="page-title mb-0 uppercase">
          {{ LABEL.BUTTON.ADD_TEACHER }}
        </h2>
      </div>

      <!-- Content -->
      <form class="modal-content" @submit.prevent="handleSubmit">
        <!-- Name -->
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="form-label">{{ LABEL.FIRST_NAME }}</label>
            <input v-model="form.first_name" type="text" class="input-field" />
          </div>

          <div>
            <label class="form-label">{{ LABEL.MIDDLE_NAME }}</label>
            <input v-model="form.middle_name" type="text" class="input-field" :placeholder="LABEL.PLACEHOLDER.OPTIONAL" />
          </div>

          <div>
            <label class="form-label">{{ LABEL.LAST_NAME }}</label>
            <input v-model="form.last_name" type="text" class="input-field" />
          </div>
        </div>

        <!-- Contact -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">{{ LABEL.CONTACT_NUMBER }}</label>
            <input v-model="form.phone" type="tel" class="input-field" />
          </div>

          <div>
            <label class="form-label">{{ LABEL.TEACHER_EMAIL }}</label>
            <input v-model="form.email" type="text" class="input-field" />
          </div>
        </div>

        <!-- Teacher Info -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">{{ LABEL.EMPLOYEE_CODE }}</label>
            <input
              v-model="form.employee_code"
              type="text"
              class="input-field"
              :placeholder="LABEL.PLACEHOLDER.AUTO_GENERATED"
              disabled
            />
          </div>

          <div>
            <label class="form-label">{{ LABEL.SPECIALIZATION }}</label>
            <select class="selectbox-field" v-model="form.specialization">
              <option disabled>{{ LABEL.SELECT_BOX.SELECT_SUBJECT }}</option>
              <option v-for="subject in props.subjects"
                :key=subject.id
                :value="subject.subject_name.toUpperCase().replaceAll(' ', '_')"
              >
                {{ subject.subject_name }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">{{ LABEL.EXPERIENCE_YEARS }}</label>
            <input v-model="form.experience_years" type="number" class="input-field" />
          </div>

          <div>
            <label class="form-label">{{ LABEL.STATUS }}</label>
            <select v-model="form.status" class="selectbox-field">
              <option v-for="option in LABEL.OPTIONS.STATUS"
                :key="option.value"
                :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Class Assignment -->
        <div class="mt-6">
          <h3 class="text-md font-semibold mb-2">
            {{ LABEL.CLASS_ASSIGNMENT }}
          </h3>

          <!-- Todo: Add "Add class assignment button" -->

          <div v-if="form.classes.length > 0">
            <div
                v-for="(classAssignment, index) in form.classes"
                :key="classAssignment.id || index"
                class="grid grid-cols-3 gap-4"
              >
                <!-- Class -->
                <div>
                  <label class="form-label">{{ LABEL.CLASS }}</label>

                  <select
                    v-model="classAssignment.class_id"
                    class="selectbox-field"
                  >
                    <option disabled value="">
                      {{ LABEL.SELECT_BOX.SELECT_CLASS }}
                    </option>

                    <option
                      v-for="classData in classes"
                      :key="classData.id"
                      :value="classData.id"
                    >
                      {{ classData.name }}
                    </option>
                  </select>
                </div>

                <!-- Section -->
                <div>
                  <label class="form-label">{{ LABEL.SECTION }}</label>

                  <select
                    v-model="classAssignment.section_id"
                    class="selectbox-field"
                  >
                    <option disabled value="">
                      {{ LABEL.SELECT_BOX.SELECT_SECTION }}
                    </option>
                    <option
                      v-for="section in sections"
                      :key="section.id"
                      :value="section.id"
                    >
                      {{ section.section_name }}
                    </option>
                  </select>
                </div>

                <!-- Academic Year -->
                <div>
                  <label class="form-label">{{ LABEL.ACADEMIC_YEAR }}</label>

                  <select
                    v-model="classAssignment.academic_year_id"
                    class="selectbox-field"
                  >
                    <option disabled value="">
                      {{ LABEL.SELECT_BOX.SELECT_ACADEMIC_YEAR }}
                    </option>
                    <option
                      v-for="academicYear in academicYears"
                      :key="academicYear.id"
                      :value="academicYear.id"
                    >
                      {{ academicYear.name }}
                    </option>
                  </select>
                </div>
            </div>
          </div>
          <div v-else>
            <div class="info-box-blue mt-4">
              <p class="info-text-blue">
                <span class="font-medium">{{ LABEL.NOTE.NO_CLASS_ASSIGNMENT }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Address -->
        <div class="mt-4">
          <label class="form-label">{{ LABEL.ADDRESS }}</label>
          <input v-model="form.address" type="text" class="input-field" />
        </div>

        <!-- Note -->
        <div class="info-box-blue mt-4">
          <p class="info-text-blue">
            <span class="font-medium">{{ LABEL.NOTE_LABEL }}:</span>
            {{ LABEL.NOTE.TEACHER_ASSIGN_MULTIPLE_CLASSES }}
          </p>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button @click="closeModal" type="button" class="button-modal-cancel">
            {{ LABEL.BUTTON.CANCEL }}
          </button>

          <button :disabled="isSubmitBtnClicked" type="submit" class="button-modal-save">
            {{ LABEL.BUTTON.SAVE }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, reactive } from 'vue';
  import { useCreateAndUpdateTeacher } from '@/composables/useCreateAndUpdateTeacher';
  import { getClasses } from '@/services/classes/getClassData';
  import { getSections } from '@/services/section/getSection';
  import { getAcademicYears } from '@/services/academic-years/getAcademicYears';
  import { LABEL } from '@/constants/label';
  import { MESSAGE } from '@/constants/message';
  import { USER_ROLE } from '@/constants/userRole';

  /**
   * Run methods before the page loads.
  */
  onMounted(async () => {
    await handleGetClassAssignmentData();
  });

  /**
   * Component emits.
   */
  const emit = defineEmits([
    'close',
    'showFlashMessage',
    'refreshTable',
  ]);
  /**
   * Component props.
   */
  const props = defineProps({
    teacher: Object,
    subjects: Array,
  });
  const classes = ref([]);
  const sections = ref([]);
  const academicYears = ref([]);

  /**
   * Returns the default/initial form state.
   *
   * @returns {Object} Default form values
   */
  const form = reactive({
    role: USER_ROLE.TEACHER,
    first_name: props.teacher.user.first_name ?? '',
    middle_name: props.teacher.user?.middle_name ?? '',
    last_name: props.teacher.user.last_name ?? '',
    phone: props.teacher.phone ?? '',
    email: props.teacher.user.email ?? '',
    employee_code: props.teacher.employee_code ?? '',
    specialization: props.teacher.specialization ?? '',
    experience_years: props.teacher.experience_years ?? '',
    status: props.teacher.user.is_active ?? '',
    address: props.teacher.address ?? '',
    classes: props.teacher.teacher_class_assignments?.map(
      assignment => ({
        id: assignment.id,
        class_id: assignment.class_id,
        section_id: assignment.section_id,
        academic_year_id: assignment.academic_year_id,
      })
    ) ?? [],
  });

  /**
   * Closes the form modal.
   */
  const closeModal = () => emit('close');

  const { submit, isSubmitBtnClicked } = useCreateAndUpdateTeacher(form, props.teacher.user.id);

  /**
   * Call the submit button and emit a flash message.
   */
  const handleSubmit = async () => {
    try {
      const response = await submit();

      console.log(response);

      if (!response.success) return;

      emit('showFlashMessage', {
        flash: MESSAGE.SUCCESS.STUDENTS_CREATED_SUCCESSFULLY,
        success: response.success,
        message: response.message,
      });

      emit('refreshTable');
      emit('close');
    } catch (error) {
      emit('showFlashMessage', {
        success: false,
        message: error.message || MESSAGE.ERROR.USER_UPDATE_FAILED,
      });
    }
  }

  /**
   * Sets the data for class, section, and academic year upon form load.
   * 
   * @throws {Error} If the request fails.
   */
  const handleGetClassAssignmentData = async () => {
    try {
      const classResponse = await getClasses();
      if (!classResponse.data.success) return;
      classes.value = classResponse.data.data;
      
      const sectionResponse = await getSections();
      if (!sectionResponse.data.success) return;
      sections.value = sectionResponse.data.data;

      const academicYearResponse = await getAcademicYears();
      if (!academicYearResponse.data.success) return;
      academicYears.value = academicYearResponse.data.data;
      
    } catch (error) {
      throw new Error(error.response?.data?.message || MESSAGE.ERROR.ERROR_FETCHING_DATA);
    }
  }
</script>