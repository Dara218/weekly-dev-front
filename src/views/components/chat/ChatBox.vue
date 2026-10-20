<template>
  <div>
    <input
      id="chatbox-toggle"
      v-model="isChatOpen"
      type="checkbox"
      class="peer sr-only"
    />

    <!-- Chat panel -->
    <div
      class="fixed bottom-20 right-5 z-50 hidden h-[min(520px,70vh)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xl shadow-blue-900/10 peer-checked:flex"
    >
      <!-- Header -->
      <div class="relative flex items-center gap-3 bg-blue-600 px-4 py-4 text-white">
        <div class="relative shrink-0">
          <div class="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <span class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-blue-600 bg-emerald-400"></span>
        </div>

        <div class="min-w-0 flex-1">
          <h2 class="truncate text-base font-semibold tracking-tight">
            {{ LABEL.SUPPORT }}
          </h2>
          <p class="truncate text-xs text-blue-100">
            {{ LABEL.CHAT_STATUS }}
          </p>
        </div>

        <label
          for="chatbox-toggle"
          class="shrink-0 cursor-pointer rounded-lg p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white"
          :aria-label="LABEL.CLOSE_CHAT"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </label>
      </div>

      <!-- Messages -->
      <div
        ref="messagesContainer"
        class="flex flex-1 flex-col gap-3 overflow-y-auto bg-linear-to-b from-slate-50 to-white px-4 py-4"
        @scroll="loadOlderOnScroll"
      >
        <!-- History loading -->
        <div
          v-if="chatStore.isLoading"
          class="flex flex-1 flex-col items-center justify-center gap-3"
          aria-busy="true"
          :aria-label="LABEL.LOADING_CONVERSATION"
        >
          <Spinner />
          <p class="text-xs text-gray-500">
            {{ LABEL.LOADING_CONVERSATION }}
          </p>
        </div>

        <!-- Empty state -->
        <div
          v-else-if="chatStore.messages.length === 0"
          class="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center"
        >
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.75"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">
              {{ LABEL.HOW_CAN_WE_HELP }}
            </p>
            <p class="mt-1 text-xs leading-relaxed text-gray-500">
              {{ LABEL.CHAT_EMPTY_MESSAGE }}
            </p>
          </div>
        </div>

        <div
          v-if="chatStore.isLoadingMore"
          class="flex justify-center py-1"
          :aria-label="LABEL.LOADING_EARLIER_MESSAGES"
        >
          <Spinner />
        </div>

        <div
          v-for="msg in chatStore.messages"
          v-show="!chatStore.isLoading"
          :key="msg.id"
          class="flex max-w-[85%] flex-col"
          :class="msg.isOwn ? 'ml-auto items-end' : 'items-start'"
        >
          <div
            class="rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm"
            :class="msg.isOwn
              ? 'rounded-br-md bg-blue-600 text-white'
              : 'rounded-bl-md border border-gray-100 bg-white text-gray-800'"
          >
            <p
              v-if="msg.text"
              class="whitespace-pre-wrap wrap-break-word"
            >
              {{ msg.text }}
            </p>
            <div
              v-else-if="chatStore.isStreaming && !msg.isOwn"
              class="flex items-center gap-2 py-0.5"
              :aria-label="LABEL.THINKING"
            >
              <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:0ms]"></span>
              <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:150ms]"></span>
              <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:300ms]"></span>
              <span class="text-xs text-gray-400">{{ LABEL.THINKING }}</span>
            </div>
          </div>
          <span
            class="mt-1 px-1 text-[11px]"
            :class="msg.isOwn ? 'text-gray-400' : 'text-gray-400'"
          >
            {{ msg.timestamp }}
          </span>
        </div>
      </div>

      <!-- Composer -->
      <div class="border-t border-gray-100 bg-white p-3">
        <div class="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-2 py-1.5 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20">
          <input
            v-model="inputMessage"
            type="text"
            :placeholder="LABEL.PLACEHOLDER.TYPE_A_MESSAGE"
            :disabled="chatStore.isStreaming || chatStore.isLoading"
            class="min-w-0 flex-1 border-0 bg-transparent px-2 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 disabled:opacity-50"
            @keyup.enter="sendMessage"
          />
          <button
            type="button"
            :disabled="chatStore.isStreaming || chatStore.isLoading || !inputMessage.trim()"
            class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:bg-slate-300"
            :aria-label="LABEL.SEND_MESSAGE"
            @click="sendMessage"
          >
            <svg
              v-if="!chatStore.isStreaming"
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <span
              v-else
              class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
            ></span>
          </button>
        </div>
      </div>
    </div>

    <!-- FAB: chat icon (closed) -->
    <label
      for="chatbox-toggle"
      class="fixed bottom-5 right-5 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/40 transition hover:scale-105 hover:bg-blue-700 peer-checked:hidden"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </label>

    <!-- FAB: close icon (open) -->
    <label
      for="chatbox-toggle"
      class="fixed bottom-5 right-5 z-50 hidden h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/40 transition hover:scale-105 hover:bg-blue-700 peer-checked:flex"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </label>
  </div>
</template>

<script setup>
  import { ref, watch, nextTick } from 'vue';
  import { useAuthStore } from '@/stores/useAuthStore';
  import { useChatStore } from '@/stores/useChatStore';
  import { LABEL } from '@/constants/label';
  import Spinner from '@/views/components/Spinner.vue';

  const auth = useAuthStore();
  const chatStore = useChatStore();
  const inputMessage = ref('');
  const messagesContainer = ref(null);
  const isChatOpen = ref(false);
  const stickToBottom = ref(true);

  /**
   * Loads history the first time the panel opens in this session.
   */
  watch(isChatOpen, (open) => {
    if (!open || !auth.isAuthenticated || chatStore.isStreaming || chatStore.hasLoaded) {
      return;
    }

    chatStore.loadLatestConversation();
  });

  /**
   * Clears the thread on logout and loads history when signing in with the panel open.
   */
  watch(
    () => auth.isAuthenticated,
    (isAuthenticated) => {
      if (!isAuthenticated) {
        chatStore.reset();
        return;
      }

      if (!isChatOpen.value || chatStore.isStreaming) {
        return;
      }

      chatStore.loadLatestConversation();
    }
  );

  /**
   * Scrolls to the latest message while the user is near the bottom.
   */
  watch(
    () => chatStore.messages.map((message) => message.text),
    async () => {
      await nextTick();
      const container = messagesContainer.value;

      if (!container || !stickToBottom.value) {
        return;
      }

      container.scrollTop = container.scrollHeight;
    },
    { deep: true }
  );

  /**
   * Sends the current input text through the chat store.
   */
  const sendMessage = async () => {
    const text = inputMessage.value.trim();

    if (!text || chatStore.isStreaming || chatStore.isLoading) {
      return;
    }

    inputMessage.value = '';
    stickToBottom.value = true;
    await chatStore.sendMessage(text);
  };

  /**
   * Loads the previous page at the top of the thread without jumping the scroll position.
   */
  const loadOlderOnScroll = async () => {
    const container = messagesContainer.value;

    if (!container) {
      return;
    }

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    stickToBottom.value = distanceFromBottom < 80;

    if (container.scrollTop > 40 || !chatStore.hasMoreMessages || chatStore.isLoadingMore || chatStore.isLoading) {
      return;
    }

    const previousHeight = container.scrollHeight;
    const previousTop = container.scrollTop;
    const previousCount = chatStore.messages.length;

    await chatStore.loadOlderMessages();
    await nextTick();

    if (!messagesContainer.value || chatStore.messages.length === previousCount) {
      return;
    }

    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight - previousHeight + previousTop;
  };
</script>
