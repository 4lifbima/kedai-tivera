import { ref } from 'vue'
import { defineStore } from 'pinia'

const MAX_VISIBLE_TOASTS = 3
const DEFAULT_DURATION = 2800

export const useUiStore = defineStore('ui', () => {
  const toasts = ref([])
  const timers = new Map()
  let nextId = 1

  function removeToast(id) {
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  function showToast(message, type = 'success', duration = DEFAULT_DURATION) {
    if (!message) return

    while (toasts.value.length >= MAX_VISIBLE_TOASTS) {
      removeToast(toasts.value[0].id)
    }

    const id = nextId++
    toasts.value.push({ id, message, type })

    const timer = setTimeout(() => removeToast(id), duration)
    timers.set(id, timer)
  }

  return {
    toasts,
    showToast,
    removeToast,
  }
})
