import { API_BASE_URL, API_KEY } from "./config";

/**
 * POST a support ticket to the Ticket System public API.
 *
 * @param {{ email: string, subject: string, priority: string, description: string }} payload
 * @returns {Promise<{ success: boolean, ticketId?: string, isNewUser?: boolean, error?: string }>}
 */
export async function submitTicket(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to submit ticket" };
    }

    return {
      success: true,
      ticketId: data.ticket_id,
      isNewUser: data.is_new_user === true,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Network error. Please try again.",
    };
  }
}
