import { API_ENDPOINT } from '@/constants/endpoint';
import { api } from '@/services/common/http';

const DEFAULT_PER_PAGE = 20;

/**
 * Fetch a page of invoices visible to the authenticated student or parent.
 * Parents pass `student_id` to limit the list to one linked child.
 *
 * @param {{ page?: number, per_page?: number, student_id?: number }} [params]
 *
 * @returns {Promise}
 */
export const getInvoices = ({ page, per_page = DEFAULT_PER_PAGE, student_id } = {}) => api.get(
  API_ENDPOINT.FEES.GET_INVOICES,
  { params: { page, per_page, ...(student_id ? { student_id } : {}) } },
);

/**
 * Start Stripe hosted payment for an unpaid mirrored invoice.
 *
 * @param {number|string} id
 *
 * @returns {Promise}
 */
export const payInvoice = (id) => api.post(
  `${API_ENDPOINT.FEES.PAY_INVOICE}/${encodeURIComponent(id)}/pay`,
  null,
  { headers: { Accept: 'application/json' } },
);

/**
 * Linked children for the authenticated parent.
 *
 * @returns {Promise}
 */
export const getMyChildren = () => api.get(API_ENDPOINT.FEES.PARENT_CHILDREN);

/**
 * Start Stripe hosted payment for the student's overdue invoices.
 * Parents must pass a linked child's ID.
 *
 * @param {number|string} [studentId]
 *
 * @returns {Promise}
 */
export const payOverdueInvoices = (studentId) => api.post(
  API_ENDPOINT.FEES.PAY_OVERDUE,
  studentId ? { student_id: studentId } : {},
  { headers: { Accept: 'application/json' } },
);