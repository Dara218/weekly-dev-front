import { defineStore } from "pinia";
import {
  sendChatMessage,
  streamChatMessage,
  getConversations,
  getConversation,
} from "@/services/ai/chatService";

const MESSAGE_PAGE_SIZE = 20;

/**
 * Maps one API message into the shape the chat panel renders.
 */
const mapMessage = (row) => ({
  id: row.id ?? `${row.role}-${row.created_at}`,
  text: row.content ?? row.text ?? "",
  isOwn: row.role === "user",
  timestamp: row.created_at
    ? new Date(row.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "",
  createdAt: row.created_at ? new Date(row.created_at).getTime() : 0,
});

/**
 * Reads one page of messages from a conversation payload.
 */
const readMessagePage = (body) => {
  const conversation = body?.data ?? body ?? {};
  const messages = conversation.messages ?? body?.messages ?? conversation;

  if (Array.isArray(messages?.data)) {
    return {
      rows: sortMessages(messages.data),
      currentPage: messages.current_page ?? 1,
      lastPage: messages.last_page ?? 1,
    };
  }

  if (Array.isArray(messages)) {
    return {
      rows: sortMessages(messages),
      currentPage: 1,
      lastPage: 1,
    };
  }

  return { rows: [], currentPage: 1, lastPage: 1 };
};

/**
 * Sorts mapped messages from oldest to newest.
 */
const sortMessages = (rows) =>
  rows
    .map(mapMessage)
    .filter((message) => message.text)
    .sort((a, b) => a.createdAt - b.createdAt);

export const useChatStore = defineStore("chat", {
  state: () => ({
    messages: [],
    conversationId: null,
    isStreaming: false,
    isLoading: false,
    isLoadingMore: false,
    hasLoaded: false,
    hasMoreMessages: false,
    messagePage: 1,
    isOpen: false,
  }),
  actions: {
    /**
     * Appends the user's message to the thread.
     */
    addUserMessage(text) {
      this.messages.push({
        id: Date.now(),
        text,
        isOwn: true,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    },
    /**
     * Appends an empty assistant message and returns it for streaming.
     */
    addAssistantMessage(text = "") {
      const msg = {
        id: Date.now() + 1,
        text,
        isOwn: false,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      this.messages.push(msg);
      return msg;
    },
    /**
     * Sends a message and streams the assistant reply into the thread.
     */
    async sendMessage(text) {
      this.addUserMessage(text);
      const assistantMsg = this.addAssistantMessage("");
      this.isStreaming = true;

      try {
        // Accumulation lives HERE (state), not in the service.
        let fullText = "";

        for await (const delta of streamChatMessage(text, this.conversationId)) {
          fullText += delta;
          assistantMsg.text = fullText;
        }
        // Optional non-stream fallback for debugging:
        // const { data } = await sendChatMessage(text, this.conversationId);
        // assistantMsg.text = data.data.reply;
        // this.conversationId = data.data.conversation_id;

        await this.syncConversationId();
      } catch (error) {
        assistantMsg.text = "Sorry, something went wrong. Please try again.";
        console.error(error);
      } finally {
        this.isStreaming = false;
      }
    },
    /**
     * Clears the thread and pagination state.
     */
    reset() {
      this.messages = [];
      this.conversationId = null;
      this.isLoading = false;
      this.isLoadingMore = false;
      this.isStreaming = false;
      this.hasLoaded = false;
      this.hasMoreMessages = false;
      this.messagePage = 1;
    },
    /**
     * Loads the latest conversation's first message page.
     */
    async loadLatestConversation() {
      this.isLoading = true;

      try {
        const { data } = await getConversations();
        const list = data?.data?.data ?? data?.data ?? [];
        const latest = list[0];

        if (!latest?.id) {
          this.hasLoaded = true;
          return;
        }

        this.conversationId = latest.id;

        const detail = await getConversation(latest.id, {
          page: 1,
          per_page: MESSAGE_PAGE_SIZE,
        });
        const page = readMessagePage(detail.data);

        this.messages = page.rows;
        this.messagePage = page.currentPage;
        this.hasMoreMessages = page.currentPage < page.lastPage;
        this.hasLoaded = true;
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    /**
     * Prepends the next older page of messages.
     */
    async loadOlderMessages() {
      if (!this.conversationId || !this.hasMoreMessages || this.isLoadingMore || this.isLoading) {
        return;
      }

      this.isLoadingMore = true;
      const nextPage = this.messagePage + 1;

      try {
        const detail = await getConversation(this.conversationId, {
          page: nextPage,
          per_page: MESSAGE_PAGE_SIZE,
        });
        const page = readMessagePage(detail.data);
        const existingIds = new Set(this.messages.map((message) => message.id));
        const older = page.rows.filter((message) => !existingIds.has(message.id));

        this.messages = [...older, ...this.messages];
        this.messagePage = page.currentPage || nextPage;
        this.hasMoreMessages = this.messagePage < page.lastPage && older.length > 0;
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoadingMore = false;
      }
    },
    /**
     * Stores the latest conversation id after the first send.
     */
    async syncConversationId() {
      if (this.conversationId) return;

      const { data } = await getConversations();
      const list = data?.data?.data ?? data?.data ?? [];

      if (list[0]?.id) this.conversationId = list[0].id;
    },
  },
});
