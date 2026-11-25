const ALLOWED_REDIRECT_HOSTS = ['checkout.stripe.com', 'invoice.stripe.com'];

/**
 * Accept only HTTPS Stripe URLs before the browser leaves the app.
 *
 * @param {unknown} value
 *
 * @returns {boolean}
 */
export function isAllowedRedirect(value) {
  try {
    const url = new URL(String(value ?? ''));
    return url.protocol === 'https:' && ALLOWED_REDIRECT_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}

/**
 * Today's date in Asia/Manila as YYYY-MM-DD. Due dates are set in that timezone.
 *
 * @param {Date} [now]
 *
 * @returns {string}
 */
export function manilaToday(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila' }).format(now);
}

/**
 * An unpaid invoice is overdue once its due date (a calendar day in Manila) has passed.
 *
 * @param {object} invoice
 * @param {string} [today] YYYY-MM-DD in Asia/Manila.
 *
 * @returns {boolean}
 */
export function isOverdue(invoice, today = manilaToday()) {
  if (invoice?.status !== 'UNPAID' || !invoice?.due_date) return false;

  return String(invoice.due_date).slice(0, 10) < today;
}

/**
 * Display label for an invoice number.
 *
 * @param {object} invoice
 *
 * @returns {string|number}
 */
export function invoiceLabel(invoice) {
  return invoice?.invoice_no || invoice?.id || '';
}

/**
 * Map an API error to a message for the user.
 *
 * @param {object} error Axios-style error.
 *
 * @returns {string}
 */
export function paymentError(error) {
  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return data?.message || 'You do not have permission to do this.';
  if (status === 404) return 'Invoice not found.';

  const firstValidation = data?.errors ? Object.values(data.errors).flat()[0] : null;

  return firstValidation || data?.message || error.message || 'Something went wrong. Please try again.';
}
