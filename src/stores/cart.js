import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { products as productCatalog } from '@/data/products'
import { readStorage, writeStorage } from '@/composables/useLocalStorage'

const STORAGE_KEY = 'tivera.cart.v1'
const MAX_QUANTITY = 99
const productMap = new Map(productCatalog.map((product) => [product.id, product]))

function sanitizeItems(value) {
  if (!Array.isArray(value)) return []

  const cleaned = []
  for (const item of value) {
    if (!item || !productMap.has(item.id)) continue

    const quantity = Number(item.quantity)
    if (!Number.isInteger(quantity) || quantity <= 0) continue
    if (cleaned.some((entry) => entry.id === item.id)) continue

    cleaned.push({
      id: item.id,
      quantity: Math.min(MAX_QUANTITY, quantity),
    })
  }

  return cleaned
}

export const useCartStore = defineStore('cart', () => {
  const items = ref(sanitizeItems(readStorage(STORAGE_KEY, [])))

  const detailedItems = computed(() =>
    items.value
      .map((item) => {
        const product = productMap.get(item.id)
        if (!product) return null

        return {
          ...product,
          quantity: item.quantity,
          subtotal: product.price * item.quantity,
        }
      })
      .filter(Boolean),
  )

  const totalItems = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0),
  )

  const uniqueItemCount = computed(() => items.value.length)

  const subtotal = computed(() =>
    detailedItems.value.reduce((total, item) => total + item.subtotal, 0),
  )

  function addItem(productId, quantity = 1) {
    const product = productMap.get(productId)
    const amount = Math.max(1, Math.floor(Number(quantity) || 1))

    if (!product || !product.isAvailable) return false

    const existing = items.value.find((item) => item.id === productId)
    if (existing) {
      existing.quantity = Math.min(MAX_QUANTITY, existing.quantity + amount)
      return true
    }

    items.value.push({ id: productId, quantity: Math.min(MAX_QUANTITY, amount) })
    return true
  }

  function increment(productId) {
    const item = items.value.find((entry) => entry.id === productId)
    if (!item) return
    item.quantity = Math.min(MAX_QUANTITY, item.quantity + 1)
  }

  function decrement(productId) {
    const item = items.value.find((entry) => entry.id === productId)
    if (!item || item.quantity <= 1) return
    item.quantity -= 1
  }

  function setQuantity(productId, quantity) {
    const item = items.value.find((entry) => entry.id === productId)
    if (!item) return

    const next = Math.min(MAX_QUANTITY, Math.max(1, Math.floor(Number(quantity) || 1)))
    item.quantity = next
  }

  function removeItem(productId) {
    items.value = items.value.filter((item) => item.id !== productId)
  }

  function clearCart() {
    items.value = []
  }

  function quantityOf(productId) {
    return items.value.find((item) => item.id === productId)?.quantity ?? 0
  }

  watch(
    items,
    (value) => {
      writeStorage(STORAGE_KEY, value)
    },
    { deep: true },
  )

  return {
    items,
    detailedItems,
    totalItems,
    uniqueItemCount,
    subtotal,
    addItem,
    increment,
    decrement,
    setQuantity,
    removeItem,
    clearCart,
    quantityOf,
    maxQuantity: MAX_QUANTITY,
  }
})
