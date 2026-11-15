import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { products } from '@/data/products'
import { readStorage, writeStorage } from '@/composables/useLocalStorage'

const STORAGE_KEY = 'tivera.favorites.v1'
const validIds = new Set(products.map((product) => product.id))

function sanitizeIds(value) {
  if (!Array.isArray(value)) return []
  return [...new Set(value.filter((id) => validIds.has(id)))]
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteIds = ref(sanitizeIds(readStorage(STORAGE_KEY, [])))

  const favoriteProducts = computed(() =>
    products.filter((product) => favoriteIds.value.includes(product.id)),
  )

  const count = computed(() => favoriteIds.value.length)

  function isFavorite(productId) {
    return favoriteIds.value.includes(productId)
  }

  function toggleFavorite(productId) {
    if (!validIds.has(productId)) return false

    if (isFavorite(productId)) {
      favoriteIds.value = favoriteIds.value.filter((id) => id !== productId)
      return false
    }

    favoriteIds.value = [...favoriteIds.value, productId]
    return true
  }

  function clearFavorites() {
    favoriteIds.value = []
  }

  watch(
    favoriteIds,
    (value) => {
      writeStorage(STORAGE_KEY, value)
    },
    { deep: true },
  )

  return {
    favoriteIds,
    favoriteProducts,
    count,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  }
})
