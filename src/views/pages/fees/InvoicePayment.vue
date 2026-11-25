<template>
  <main class="page-table-container">
    <div class="page-header-wrapper max-w-3xl space-y-6">
    <h1 class="text-2xl font-bold">{{ LABEL.FEES_PAGE.TITLE }}</h1>

    <section v-if="auth.isParent" class="space-y-2">
      <label for="child-select" class="form-label">{{ LABEL.FEES_PAGE.CHILD }}</label>
      <select
        id="child-select"
        v-model="selectedStudentId"
        class="input-field"
        :disabled="loadingChildren || children.length === 0"
      >
        <option v-for="child in children" :key="child.id" :value="child.id">
          {{ child.name || LABEL.FEES_PAGE.STUDENT_FALLBACK(child.id) }}
        </option>
      </select>
      <p v-if="!loadingChildren && children.length === 0" role="status">
        {{ LABEL.FEES_PAGE.NO_LINKED_CHILDREN }}
      </p>
    </section>

    <p v-if="error" class="error-message" role="alert">{{ error }}</p>

    <section v-if="scopeReady" class="space-y-3">
      <h2 class="text-xl font-semibold">{{ LABEL.FEES_PAGE.INVOICES }}</h2>
      <p v-if="loadingInvoices" role="status">{{ LABEL.FEES_PAGE.LOADING_INVOICES }}</p>
      <p v-else-if="invoices.length === 0">{{ LABEL.FEES_PAGE.NO_INVOICES }}</p>
      <template v-else>
        <p v-if="payableTotal.count > 0" class="font-semibold" role="status">
          {{ LABEL.FEES_PAGE.OWED_SUMMARY(payableTotal.amount, payableTotal.count) }}
        </p>
        <button
          v-if="overduePayable.count >= 2"
          class="button-common-action"
          :disabled="payingId !== null || payingOverdue"
          @click="payOverdue"
        >
          {{
            payingOverdue
              ? LABEL.FEES_PAGE.OPENING_STRIPE
              : LABEL.FEES_PAGE.PAY_OVERDUE(overduePayable.amount)
          }}
        </button>
        <ul class="space-y-3">
          <li v-for="row in invoices" :key="row.id" class="border rounded-lg p-4 space-y-1">
            <p class="font-semibold">{{ LABEL.FEES_PAGE.INVOICE_TITLE(invoiceLabel(row)) }}</p>
            <p v-if="row.student_name">{{ LABEL.FEES_PAGE.STUDENT_LINE(row.student_name) }}</p>
            <p class="font-semibold">{{ LABEL.FEES_PAGE.DUE_LINE(dueDateOf(row)) }}</p>
            <p v-if="row.is_overdue || isOverdue(row)" class="font-semibold text-red-600" role="status">
              {{ LABEL.FEES_PAGE.OVERDUE_NOTICE }}
            </p>
            <p>{{ LABEL.FEES_PAGE.STATUS_OUTSTANDING(row.status, row.outstanding) }}</p>
            <button
              v-if="row.can_pay"
              class="button-common-action"
              :disabled="payingId !== null || payingOverdue"
              @click="pay(row)"
            >
              {{
                payingId === row.id
                  ? LABEL.FEES_PAGE.OPENING_STRIPE
                  : LABEL.FEES_PAGE.PAY_INVOICE
              }}
            </button>
          </li>
        </ul>
      </template>
      <div v-if="meta.last_page > 1" class="flex gap-3 items-center">
        <button
          class="button-common-navigation"
          :disabled="loadingInvoices || meta.current_page <= 1"
          @click="loadInvoices(meta.current_page - 1)"
        >
          {{ LABEL.FEES_PAGE.PREVIOUS }}
        </button>
        <span>{{ LABEL.FEES_PAGE.PAGE_OF(meta.current_page, meta.last_page) }}</span>
        <button
          class="button-common-navigation"
          :disabled="loadingInvoices || meta.current_page >= meta.last_page"
          @click="loadInvoices(meta.current_page + 1)"
        >
          {{ LABEL.FEES_PAGE.NEXT }}
        </button>
      </div>
    </section>
    </div>
  </main>
</template>

<script setup>
/**
 * InvoicePayment page
 *
 * Lists school fee invoices for the authenticated student or parent.
 * Parents pick a linked child first; students load their own invoices.
 * Pay and Pay overdue redirect to Stripe hosted payment URLs.
 */
import { computed, onMounted, ref, watch } from 'vue';
import { LABEL } from '@/constants/label';
import { MESSAGE } from '@/constants/message';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  getInvoices,
  getMyChildren,
  payInvoice,
  payOverdueInvoices,
} from '@/services/fees/invoiceService';
import { invoiceLabel, isAllowedRedirect, isOverdue, paymentError } from '@/utils/invoiceUtils';

/**
 * Auth store for the currently logged-in user.
 * Students load their own invoices; parents must select a linked child.
 */
const auth = useAuthStore();

/**
 * Linked children returned by GET /api/parent/children.
 * Used only when the authenticated user is a parent.
 */
const children = ref([]);

/**
 * Selected child ID for parent invoice and payment requests.
 */
const selectedStudentId = ref(null);

/**
 * Whether the parent children list is still loading.
 */
const loadingChildren = ref(false);

/**
 * Current page of invoices from GET /api/invoices.
 */
const invoices = ref([]);

/**
 * Pagination metadata for the invoice list.
 */
const meta = ref({ current_page: 1, last_page: 1, per_page: 20, total: 0 });

/**
 * Whether the invoice list is still loading.
 */
const loadingInvoices = ref(false);

/**
 * Invoice ID currently opening a Stripe payment page, or null when idle.
 */
const payingId = ref(null);

/**
 * Whether an overdue bulk payment redirect is in progress.
 */
const payingOverdue = ref(false);

/**
 * User-facing error message from the latest failed request.
 */
const error = ref('');

/**
 * Monotonic request counter used to ignore stale invoice responses.
 */
let invoiceRequest = 0;

/**
 * Whether the page has enough context to load invoices.
 * Parents must pick a linked child; students are always ready.
 */
const scopeReady = computed(() => auth.isStudent || (auth.isParent && selectedStudentId.value !== null));

/**
 * Student ID sent to the API.
 * Parents send the selected child; students omit it so Laravel uses their profile.
 *
 * @returns {number|undefined}
 */
const studentScope = () => (auth.isParent ? selectedStudentId.value : undefined);

/**
 * Format an invoice due date as a calendar day.
 * The API may send a datetime string.
 *
 * @param {object} row - Invoice row from the API.
 *
 * @returns {string}
 */
const dueDateOf = (row) => String(row.due_date ?? '').slice(0, 10);

/**
 * Sum only unpaid invoices that already have a hosted payment URL.
 *
 * @param {Array<object>} rows - Invoice rows to total.
 *
 * @returns {{ count: number, amount: string }}
 */
const sumPayable = (rows) => {
  const payable = rows.filter((row) => row.can_pay);
  const total = payable.reduce((sum, row) => sum + Number(row.outstanding || 0), 0);

  return {
    count: payable.length,
    amount: total.toFixed(2),
  };
};

/**
 * Payable totals for every invoice on the current page.
 */
const payableTotal = computed(() => sumPayable(invoices.value));

/**
 * Payable totals for overdue invoices on the current page.
 */
const overduePayable = computed(() => sumPayable(
  invoices.value.filter((row) => row.is_overdue || isOverdue(row)),
));

/**
 * Fetch the authenticated parent's linked children and select the first one.
 *
 * @returns {Promise<void>}
 */
async function loadChildren() {
  loadingChildren.value = true;
  try {
    const { data } = await getMyChildren();
    children.value = data.data ?? [];
    selectedStudentId.value = children.value[0]?.id ?? null;
  } catch (failure) {
    error.value = paymentError(failure);
  } finally {
    loadingChildren.value = false;
  }
}

/**
 * Fetch a page of invoices for the current student scope.
 * Ignores stale responses when a newer request has already started.
 *
 * @param {number} [nextPage=1] - Page number to load.
 *
 * @returns {Promise<void>}
 */
async function loadInvoices(nextPage = 1) {
  if (!scopeReady.value) {
    invoices.value = [];
    return;
  }
  const current = ++invoiceRequest;
  loadingInvoices.value = true;
  try {
    const { data } = await getInvoices({ page: nextPage, student_id: studentScope() });
    if (current !== invoiceRequest) return;
    invoices.value = data.data ?? [];
    meta.value = data.meta ?? meta.value;
  } catch (failure) {
    if (current === invoiceRequest) error.value = paymentError(failure);
  } finally {
    if (current === invoiceRequest) loadingInvoices.value = false;
  }
}

/**
 * Open Stripe hosted payment for a single unpaid invoice.
 *
 * @param {object} row - Invoice row with can_pay true.
 *
 * @returns {Promise<void>}
 */
async function pay(row) {
  if (payingId.value !== null || payingOverdue.value) return;
  payingId.value = row.id;
  error.value = '';
  try {
    const { data } = await payInvoice(row.id);
    const url = data.data?.url;
    if (!isAllowedRedirect(url)) throw new Error(MESSAGE.ERROR.INVALID_STRIPE_PAYMENT_URL);
    window.location.assign(url);
  } catch (failure) {
    error.value = paymentError(failure);
    payingId.value = null;
  }
}

/**
 * Open Stripe hosted payment for all overdue invoices in the current scope.
 *
 * @returns {Promise<void>}
 */
async function payOverdue() {
  if (payingId.value !== null || payingOverdue.value) return;
  payingOverdue.value = true;
  error.value = '';
  try {
    const { data } = await payOverdueInvoices(studentScope());
    const url = data.data?.url;
    if (!isAllowedRedirect(url)) throw new Error(MESSAGE.ERROR.INVALID_STRIPE_PAYMENT_URL);
    window.location.assign(url);
  } catch (failure) {
    error.value = paymentError(failure);
    payingOverdue.value = false;
  }
}

/**
 * Reload the first invoice page when the parent changes the selected child.
 */
watch(selectedStudentId, () => {
  error.value = '';
  invoices.value = [];
  meta.value = { current_page: 1, last_page: 1, per_page: 20, total: 0 };
  loadInvoices(1);
});

/**
 * Load children for parents, or invoices for students, when the page mounts.
 */
onMounted(async () => {
  if (auth.isParent) {
    await loadChildren();
    return;
  }
  loadInvoices(1);
});
</script>
