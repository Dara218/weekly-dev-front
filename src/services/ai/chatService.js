import { API_ENDPOINT } from "@/constants/endpoint";
import { api, apiUrl, getSanctumFetchHeaders } from "../common/http";

/**
 * Sends a chat message and returns the full JSON reply.
 *
 * @param {string} message
 * @param {string|null} [conversationId]
 *
 * @returns {Promise}
 */
export const sendChatMessage = (message, conversationId = null) =>
  api.post(API_ENDPOINT.AI_CHAT.SEND, {
    message,
    conversation_id: conversationId,
  });

/**
 * Streams a chat reply and yields each text delta.
 *
 * @param {string} message
 * @param {string|null} [conversationId]
 *
 * @returns {AsyncGenerator<string, void, unknown>}
 */
export async function* streamChatMessage(message, conversationId = null) {
  // fetch is required for ReadableStream; Axios responseType:'stream'
  // is awkward in browsers. Reuse Axios baseURL + Sanctum headers instead
  // of duplicating env/cookie parsing here.
  const response = await fetch(apiUrl(API_ENDPOINT.AI_CHAT.STREAM), {
    method: "POST",
    headers: getSanctumFetchHeaders({
      Accept: "text/event-stream",
    }),
    credentials: "include",
    body: JSON.stringify({
      message,
      conversation_id: conversationId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Chat stream failed (${response.status})`);
  }

  if (!response.body) {
    throw new Error("Chat stream has no body");
  }

  yield* readSseDataLines(response.body);
}

/**
 * Yields decoded SSE data lines from a stream body.
 *
 * @param {ReadableStream<Uint8Array>} body
 *
 * @returns {AsyncGenerator<string, void, unknown>}
 */
async function* readSseDataLines(body) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const text = parseSseDataLine(line);
        if (text !== null) yield text;
      }
    }

    const trailing = parseSseDataLine(buffer);
    if (trailing !== null) yield trailing;
  } finally {
    reader.releaseLock();
  }
}

/**
 * Returns the text delta from one SSE line, or null when it should be ignored.
 *
 * @param {string} line
 *
 * @returns {string|null}
 */
function parseSseDataLine(line) {
  if (!line.startsWith("data: ")) return null;

  const data = line.slice(6).trimEnd();
  if (data === "" || data === "[DONE]") return null;

  try {
    const event = JSON.parse(data);

    if (event.type === "text_delta" && typeof event.delta === "string") {
      return event.delta; // "Hello", " looks", " you", ...
    }

    return null; // ignore stream_start, stream_end, etc.
  } catch {
    return data;
  }
}

/**
 * Fetches the authenticated user's chat conversations.
 *
 * @returns {Promise}
 */
export const getConversations = () =>
  api.get(API_ENDPOINT.AI_CHAT.CONVERSATIONS);

/**
 * Fetches one conversation, optionally paginated.
 *
 * @param {string|number} conversationId
 * @param {Object} [params]
 *
 * @returns {Promise}
 */
export const getConversation = (conversationId, params = {}) =>
  api.get(`${API_ENDPOINT.AI_CHAT.CONVERSATION}/${conversationId}`, { params });
