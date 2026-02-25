<template>
  <div class="table-container p-4 space-y-4">
    <h3 class="text-lg font-semibold text-gray-900">Overview</h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
      <div>
        <div class="form-label">Admission #</div>
        <div>{{ props.student.admission_no }}</div>
      </div>
      <div>
        <div class="form-label">Name</div>
        <div>{{ props.student.user.first_name }} {{ props.student.user?.middle_name }} {{ props.student.user.last_name }}</div>
      </div>
      <div>
        <div class="form-label">DOB</div>
        <div>{{ props.student.dob }}</div>
      </div>
      <div>
        <div class="form-label">Gender</div>
        <div>{{ props.student.gender }}</div>
      </div>
      <div>
        <div class="form-label">Class</div>
        <div>{{ props.student.class.name.replace('_', ' ') }}</div>
      </div>
      <div>
        <div class="form-label">Section</div>
        <div>{{ props.student.section.section_name }}</div>
      </div>
      <div>
        <div class="form-label">Guardian</div>
        <div>{{ props.student.parent.user.first_name }} {{ props.student.parent.user?.middle_name }} {{ props.student.parent.user.last_name }}</div>
      </div>
      <div>
        <div class="form-label">Phone</div>
        <div>{{ props.student.phone ?? '-' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  /**
   * Component props.
   */
  const props = defineProps({
    student: Object,
  });
</script>