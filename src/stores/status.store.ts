import { nextTick, ref } from 'vue'
import { defineStore } from 'pinia'

// Status messages ("Saved") for the one aria-live region in App.vue
export const useStatusStore = defineStore('status', () => {
  const message = ref('')

  // Cleared first, so the same message is announced again when it repeats
  async function announce(text: string): Promise<void> {
    message.value = ''
    await nextTick()
    message.value = text
  }

  return { message, announce }
})
