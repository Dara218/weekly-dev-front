<template>
  <div>
    <input
      id="chatbox-toggle"
      type="checkbox"
      class="peer sr-only"
    />

    <!-- Chat panel -->
    <div
      class="fixed bottom-20 right-5 z-50 hidden w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl peer-checked:flex"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <h2 class="font-semibold text-gray-900">
            Chat
          </h2>
          <p class="text-xs text-gray-500">
            We typically reply within a few minutes
          </p>
        </div>

        <label
          for="chatbox-toggle"
          class="shrink-0 cursor-pointer rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <svg
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </label>
      </div>

      <!-- Messages -->
      <div class="flex max-h-80 flex-col gap-3 overflow-y-auto px-4 py-4">
        <div class="max-w-[80%] rounded-2xl rounded-bl-md bg-gray-100 px-3 py-2">
          <p class="text-sm text-gray-800">
            Hi! How can we help you today?
          </p>
          <p class="mt-1 text-xs text-gray-400">
            10:02 AM
          </p>
        </div>

        <div class="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-blue-600 px-3 py-2">
          <p class="text-sm text-white">
            I have a question about my schedule.
          </p>
          <p class="mt-1 text-xs text-blue-100">
            10:03 AM
          </p>
        </div>

        <div class="max-w-[80%] rounded-2xl rounded-bl-md bg-gray-100 px-3 py-2">
          <p class="text-sm text-gray-800">
            Sure — tell us which class or date you need help with.
          </p>
          <p class="mt-1 text-xs text-gray-400">
            10:03 AM
          </p>
        </div>
        <div class="max-w-[80%] rounded-2xl rounded-bl-md bg-gray-100 px-3 py-2">
          <p class="text-sm text-gray-800">
            Sure — tell us which class or date you need help with.
          </p>
          <p class="mt-1 text-xs text-gray-400">
            10:03 AM
          </p>
        </div>
        <div class="max-w-[80%] rounded-2xl rounded-bl-md bg-gray-100 px-3 py-2">
          <p class="text-sm text-gray-800">
            Sure — tell us which class or date you need help with.
          </p>
          <p class="mt-1 text-xs text-gray-400">
            10:03 AM
          </p>
        </div>
      </div>

      <!-- Composer -->
      <div class="flex items-center gap-2 border-t border-gray-200 p-3">
        <input
          type="text"
          placeholder="Type a message..."
          class="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          class="inline-flex shrink-0 items-center justify-center rounded-md bg-blue-600 p-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- FAB: chat icon (closed) -->
    <label
      for="chatbox-toggle"
      class="fixed bottom-5 right-5 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition hover:bg-blue-700 peer-checked:hidden"
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
      class="fixed bottom-5 right-5 z-50 hidden h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition hover:bg-blue-700 peer-checked:flex"
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
