<template>
  <div class="modal-overlay" @mousedown.self="closeModal">
    <form @submit.prevent="handleSubmit" class="modal-container">
      <!-- Header -->
      <div class="modal-header">
        <h2 class="page-title mb-0 uppercase">{{ isEditStudent ? LABEL.EDIT_STUDENT : LABEL.ADD_STUDENT }}</h2>
      </div>

      <!-- Form Content - Scrollable -->
      <div class="modal-content">
        <!-- Personal Information Section -->
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="form-label">{{ firstNameLabel }}</label>
            <input type="text" class="input-field" v-model="form.first_name"/>
            <p v-if="v$.first_name.$error" class="error-message">{{ v$.first_name.$errors[0].$message }}</p>
          </div>

          <div>
            <label class="form-label">{{ middleNameLabel }}</label>
            <input
              type="text"
              class="input-field"
              v-model="form.middle_name"
              :placeholder="LABEL.PLACEHOLDER.OPTIONAL"
            />
            <p v-if="v$.middle_name.$error" class="error-message">{{ v$.middle_name.$errors[0].$message }}</p>
          </div>

          <div>
            <label class="form-label">{{ lastNameLabel }}</label>
            <input type="text" class="input-field" v-model="form.last_name"/>
            <p v-if="v$.last_name.$error" class="error-message">{{ v$.last_name.$errors[0].$message }}</p>
          </div>
        </div>

        <!-- Gender and DOB Section -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">
              {{ genderLabel }}
            </label>
            <select class="selectbox-field" v-model="form.gender">
              <option value="0" disabled selected>{{ LABEL.SELECT_BOX.SELECT_GENDER }}</option>
              <option v-for="gender in LABEL.OPTIONS.GENDER"
                :key="gender.value"
                :value="gender.value"
              >
                {{ gender.label }}
              </option>
            </select>
            <p v-if="v$.gender.$error" class="error-message">{{ v$.gender.$errors[0].$message }}</p>
          </div>

          <div>
            <label class="form-label">{{ dobLabel }}</label>
            <input type="date" class="input-field" v-model="form.dob"/>
            <p v-if="v$.dob.$error" class="error-message">{{ v$.dob.$errors[0].$message }}</p>
          </div>

          <!-- <div>
            <label class="form-label">{{ LABEL.ADMISSION_YEAR }}</label>
            <select class="selectbox-field" v-model="form.admission_year">
              <option
                v-for="admissionYear in admissionYears"
                :key="admissionYear.id"
                :value="admissionYear.name"
              >
                {{ admissionYear.name }}
              </option>
            </select>
          </div> -->
        </div>

        <!-- Academic Information Section - 2 columns -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">{{ classFieldLabel }}</label>
            <select class="selectbox-field" v-model="form.class_id">
              <option value="0" selected disabled>{{ LABEL.SELECT_BOX.SELECT_CLASS }}</option>
              <option v-for="year in classes"
                :key="year.id"
                :value="year.id"
              >
                {{ year.name.replaceAll('_', ' ') }}
              </option>
            </select>
            <p v-if="v$.class_id.$error" class="error-message">{{ v$.class_id.$errors[0].$message }}</p>
          </div>

          <div>
            <label class="form-label">{{ sectionLabel }}</label>
            <select class="selectbox-field" v-model="form.section_id">
              <option value="0" disabled>{{ LABEL.SELECT_BOX.SELECT_SECTION }}</option>
              <option v-for="section in sections"
                :key="section.id"
                :value="section.id"
              >
                {{ section.section_name }}
              </option>
            </select>
            <p v-if="v$.section_id.$error" class="error-message">{{ v$.section_id.$errors[0].$message }}</p>
          </div>
        </div>

        <!-- Admission Information Section -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">{{ LABEL.ADMISSION_NO }}</label>
            <input
              readonly
              disabled
              type="text"
              :placeholder="LABEL.PLACEHOLDER.AUTO_GENERATED"
              class="input-field"
              v-model="form.admission_no"
            />
          </div>

          <div>
            <label class="form-label">{{ parentLabel }}</label>
            <v-select
              @click="fetchParentNames"
              v-model="form.parent_id"
              :options="parents"
              label="name"
              :reduce="guardian => guardian.id"
              :placeholder="LABEL.PLACEHOLDER.SEARCH_GUARDIAN_NAME"
            />
            <p v-if="v$.parent_id.$error" class="error-message">{{ v$.parent_id.$errors[0].$message }}</p>
          </div>
        </div>

        <!-- Guardian Information Section -->
        <div class="grid grid-cols-2 gap-4">
          <!-- <div>
            <label class="form-label">Relationship:</label>
            <select class="selectbox-field">
              <option>Father</option>
              <option>Mother</option>
              <option>Guardian</option>
            </select>
          </div> -->

          <div>
            <label class="form-label">{{ phoneLabel }}</label>
            <input
              type="tel"
              class="input-field"
              v-model="form.phone"
              :placeholder="LABEL.PLACEHOLDER.OPTIONAL"
            />
            <p v-if="v$.phone.$error" class="error-message">{{ v$.phone.$errors[0].$message }}</p>
          </div>

          <div>
            <label class="form-label">{{ emailLabel }}</label>
            <input
              @keyup="removeValidationError"
              type="text"
              class="input-field"
              v-model="form.email"
            />
            <p v-if="v$.email.$error" class="error-message">{{ v$.email.$errors[0].$message }}</p>
            <p v-else-if="backendValidationError['email']" class="error-message">{{ backendValidationError['email'][0] }}</p>
          </div>
        </div>

        <!-- Login Information Section -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">{{ passwordLabel }}</label>
            <input
              type="password"
              class="input-field"
              v-model="form.password"
              />
              <p v-if="v$.password.$error" class="error-message">{{ v$.password.$errors[0].$message }}</p>
          </div>

          <!-- Status Section -->
          <div>
            <label class="form-label">{{ statusLabel }}</label>
            <select class="selectbox-field" v-model="form.status">
              <option v-for="option in LABEL.OPTIONS.STATUS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <p v-if="v$.status.$error" class="error-message">{{ v$.status.$errors[0].$message }}</p>
          </div>
        </div>

        <div>
          <label class="form-label">{{ addressLabel }}</label>
          <input type="text" class="input-field" v-model="form.address"/>
          <p v-if="v$.address.$error" class="error-message">{{ v$.address.$errors[0].$message }}</p>
        </div>

        <!-- Notes Section -->
        <div class="info-box-blue">
          <!-- <p class="info-text-blue">
            <span class="font-medium">Note:</span> Roll Number must be unique per section
          </p> -->
          <p class="info-text-blue">
            <span class="font-medium">{{ LABEL.NOTE_LABEL }}:</span> {{ LABEL.NOTE.ADMISSION_NO_IS_PERMANENT }}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button type="button" class="button-modal-cancel" @click="closeModal">
          {{ LABEL.BUTTON.CANCEL }}
        </button>
        <button :disabled="isSubmitBtnClicked" type="submit" class="button-modal-save">
          {{ LABEL.BUTTON.SAVE }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
  import { reactive, ref, computed, onMounted } from 'vue';
  import vSelect from 'vue-select'
  import 'vue-select/dist/vue-select.css'
  import { useCreateUser } from '@/composables/useCreateAndUpdateUser';
  import { isModalFieldChanged } from '@/utils/modalTogglerUtils';
  import { useGetParents } from '@/composables/useGetParents';
  import { formatFullName } from '@/utils/dataFormatterUtils';
  import { getGenderValue, getStatusValue } from '@/utils/commonOptionUtils';
  import { LABEL } from '@/constants/label';
  import { CONFIG } from '@/constants/config';
  import {
    emailField,
    inOptions,
    maxLengthField,
    passwordField,
    requiredField,
    validDate,
    phoneField,
    requiredIfEnteredField,
  } from '@/utils/validationRulesUtils';
  import { cloneDeep } from 'lodash';
  import { USER_ROLE } from '@/constants/userRole';
  import { MESSAGE } from '@/constants/message';

  /**
   * Component props.
   */
  const props = defineProps({
    isOpenRegisterModal: Boolean,
    admissionYears: Array,
    classes: Array,
    sections: Array,
    teacher_id: Number,
    student: Object,
  });

  /**
   * Component emits.
   */
  const emit = defineEmits([
    'closeModal',
    'showFlashMessage',
    'refreshTable',
  ]);

  /**
   * Run methods before the page loads.
  */
  onMounted(async () => {
    if (props.student) {
      // Pre-populate parents list so v-select can display the name
      await fetchParentNames();
    }
  });

  /**
   * Returns the default/initial form state.
   *
   * @returns {Object} Default form values
   */
  const defaultForm = () => ({
    first_name: props.student?.user?.first_name ?? '',
    middle_name: props.student?.user?.middle_name ?? '',
    last_name: props.student?.user?.last_name ?? '',
    gender: props.student?.gender ?? 0,
    dob: props.student?.dob ?? '',
    class_id: props.student?.class_id ?? 0,
    section_id: props.student?.section_id ?? 0,
    admission_no: props.student?.admission_no ?? '',
    parent_id: props.student?.parent_id ?? '',
    phone: props.student?.phone ?? '',
    email: props.student?.user?.email ?? '',
    password: '',
    status: props.student?.student_status ?? 1,
    teacher_id: props.teacher_id,
    role: USER_ROLE.STUDENT,
    address: props.student?.address ?? '',
  });

  /**
   * Reactive form object containing student registration data.
   */
  const form = reactive(defaultForm());

  /**
   * Deep clone of the initial form state for change detection.
   */
  const initialForm = cloneDeep(form);

  const isEditStudent = computed(() => !!props.student?.user?.id);

  // Field labels from constants
  const parents = ref([]);
  const parentIds = ref([]);
  const gradeLevelIds = props.classes.map(grade => grade.id);
  const sectionIds = props.sections.map(section => section.id);
  const firstNameLabel = LABEL.FIRST_NAME;
  const lastNameLabel = LABEL.LAST_NAME;
  const middleNameLabel = LABEL.MIDDLE_NAME;
  const genderLabel = LABEL.GENDER;
  const dobLabel = LABEL.DOB;
  const classFieldLabel = LABEL.CLASS;
  const sectionLabel = LABEL.SECTION;
  const parentLabel = LABEL.GUARDIAN_NAME;
  const phoneLabel = LABEL.CONTACT_NUMBER;
  const emailLabel = LABEL.STUDENT_EMAIL;
  const statusLabel = LABEL.STATUS;
  const addressLabel = LABEL.ADDRESS;
  const passwordLabel = LABEL.TEMP_PASSWORD;
  const maxCharName = CONFIG.VALIDATION.MAX_CHARS.NAME; // 50
  const maxCharEmail = CONFIG.VALIDATION.MAX_CHARS.EMAIL; // 50
  const maxCharsAddress = CONFIG.VALIDATION.MAX_CHARS.ADDRESS; // 100

  /**
   * Computed validation rules for all form fields.
   * Rules are defined based on field labels and available options.
   *
   * @returns {Object} Validation rules object for Vuelidate
   */
  const rules = computed(() => {
    return {
      first_name: {
        required: requiredField(firstNameLabel),
        maxLength: maxLengthField(firstNameLabel, maxCharName),
      },
      middle_name: {
        maxLength: maxLengthField(middleNameLabel, maxCharName),
      },
      last_name: {
        required: requiredField(lastNameLabel),
        maxLength: maxLengthField(lastNameLabel, maxCharName),
      },
      gender: {
        required: requiredField(genderLabel),
        in: inOptions(genderLabel, getGenderValue()),
      },
      dob: {
        required: requiredField(dobLabel),
        validDate: validDate(dobLabel),
      },
      class_id: {
        required: requiredField(classFieldLabel),
        in: inOptions(classFieldLabel, gradeLevelIds),
      },
      section_id: {
        required: requiredField(sectionLabel),
        in: inOptions(sectionLabel, sectionIds),
      },
      parent_id: {
        required: requiredField(parentLabel),
        in: inOptions(parentLabel, parentIds),
      },
      phone: {
        phoneValidator: phoneField(phoneLabel),
      },
      email: {
        required: requiredField(emailLabel),
        maxLength: maxLengthField(emailLabel, maxCharEmail),
        email: emailField(emailLabel),
      },
      status: {
        required: requiredField(statusLabel),
        in: inOptions(statusLabel, getStatusValue()),
      },
      password: {
        required: requiredIfEnteredField(passwordLabel),
        password: passwordField(passwordLabel),
      },
      address: {
        required: requiredField(addressLabel),
        maxLengthField: maxLengthField(addressLabel, maxCharsAddress),
      },
    };
  });

  /**
   * Fetches the list of available parents/parents from the API.
   * Maps the response to guardian options with id and name.
   * Updates parentIds for validation purposes.
   */
  const fetchParentNames = async () => {
    const { get } = useGetParents();
    const response = await get();

    parents.value = response.map(parent => ({
      id: parent.id,
      name: formatFullName(
        parent.user.first_name,
        parent.user.middle_name,
        parent.user.last_name,
      ),
    }));

    parentIds.value = parents.value.map(guardian => guardian.id);
  };

  /**
   * Modal close handler with unsaved changes detection.
   * Prompts user if there are unsaved changes before closing.
   */
  const { closeModal } = isModalFieldChanged(form, initialForm, emit);

  /**
   * Form submission handler and validation object from Vuelidate.
   */
  const { isSubmitBtnClicked, submit, v$, backendValidationError } = useCreateUser(rules, form);

  /**
   * Clears backend validation errors when the user edits the email field.
   */
  const removeValidationError = () => backendValidationError.value = [];

  /**
   * Call the submit button and emit a flash message.
   */
  const handleSubmit = async () => {
    try {
      const studentId = isEditStudent.value ? props.student.user.id : undefined;
      const response = await submit(studentId, isEditStudent.value);

      if (!response) return;

      if (response.success) {
        emit('showFlashMessage', {
          success: true,
          message: response.message,
        });

        emit('refreshTable');

        emit('closeModal');
      }
    } catch (error) {
      if (backendValidationError.value && Object.keys(backendValidationError.value).length) return;
      emit('refreshTable');

      emit('closeModal');

      emit('showFlashMessage', {
        success: false,
        message: error.message || MESSAGE.ERROR.STUDENT_CREATION_FAILED,
      });
    };
  };
</script>
