import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ensureUser } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const uid = ref<string | null>(null)
  const isReady = ref(false)

  // Called once from main.ts before the app mounts
  async function init(): Promise<void> {
    if (isReady.value) return
    uid.value = await ensureUser()
    isReady.value = true
  }

  return { uid, isReady, init }
})
