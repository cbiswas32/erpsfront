import { axiosPost } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";

// 1. Get Invoices by Vendor ID, PO ID and Date Range
export async function getInvoicesByFilterService(startDate, endDate, vendorId = 0, poId = 0) {
  return new Promise(async (resolve, reject) => {
    try {
      const token = getJWTToken();
      const user = getUserDetailsObj();

      const requestBody = {
        token,
        dataAccessDTO: {
          userId: user?.userId,
          userName: user?.loginId
        },
        startDate,
        endDate,
        vendorId,
        poId
      };

      const response = await axiosPost("/invoice/listAllInvoices", requestBody);

      if (response?.status && response?.data?.status) {
        resolve(response.data.responseObject);
      } else {
        reject(response?.data?.message || "Failed to fetch invoice list");
      }

    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Add or update an invoice
 * - If `invoice_id` is present, it updates
 * - Otherwise, creates a new one
 */
export async function saveOrUpdateInvoiceService(invoiceDTO) {
  return new Promise(async (resolve, reject) => {
    try {
      const token = getJWTToken();
      const user = getUserDetailsObj();

      const requestBody = {
        token,
        dataAccessDTO: {
          userId: user?.userId,
          userName: user?.loginId
        },
        ...invoiceDTO,
        createdBy: user?.userId,
        userId: user?.userId
      };

      const response = await axiosPost('/invoice/addInvoice', requestBody);

      if (response?.status && response?.data?.success) {
        resolve(response.data.data); // invoice object returned
      } else {
        reject(response?.data?.message || "Failed to save invoice");
      }

    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Sync invoice payments
 * If payments are added/updated/deleted, send full list for a given invoiceId
 */
export async function syncInvoicePaymentsService(invoiceId, vendorId, totalAmountAsPerInvoice, paymentList = []) {
  return new Promise(async (resolve, reject) => {
    try {
      const token = getJWTToken();
      const user = getUserDetailsObj();

      const requestBody = {
        token,
        dataAccessDTO: {
          userId: user?.userId,
          userName: user?.loginId,
        },
        invoiceId,
        vendorId,
        paymentList,
        totalAmountAsPerInvoice,
        updatedBy: user?.userId,
      };

      const response = await axiosPost("/invoice/managePayments", requestBody);

      if (response?.status && response?.data?.success) {
        resolve(response.data.message || "Payments synced successfully");
      } else {
        reject(response?.data?.message || "Failed to sync payments");
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Get all payments for a given invoice ID
 */
export async function getPaymentsByInvoiceIdService(invoiceId) {
  return new Promise(async (resolve, reject) => {
    try {
      const token = getJWTToken();
      const user = getUserDetailsObj();

      const requestBody = {
        token,
        dataAccessDTO: {
          userId: user?.userId,
          userName: user?.loginId,
        },
        invoiceId,
      };

      const response = await axiosPost("/invoice/getAllPayments", requestBody);

      if (response?.status && response?.data?.success) {
        resolve(response.data.data || []);
      } else {
        reject(response?.data?.message || "Failed to fetch payments");
      }
    } catch (error) {
      reject(error);
    }
  });
}
