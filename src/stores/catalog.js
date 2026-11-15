import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { products } from '@/data/products'

export const useCatalogStore = defineStore('catalog', () => {
  const activeCategory = ref('Semua')
  const searchQuery = ref('')

  const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase())

  const isSearching = computed(() => normalizedQuery.value.length > 0)

  const isFiltering = computed(
    () => isSearching.value || activeCategory.value !== 'Semua',
  )

  const featuredProducts = computed(() =>
    products.filter((product) => product.isFeatured),
  )

  const filteredProducts = computed(() => {
    const query = normalizedQuery.value

    return products.filter((product) => {
      const matchesCategory =
        activeCategory.value === 'Semua' || product.category === activeCategory.value
      const matchesQuery =
        query.length === 0 || product.name.toLowerCase().includes(query)

      return matchesCategory && matchesQuery
    })
  })

  const resultCount = computed(() => filteredProducts.value.length)

  function setCategory(category) {
    activeCategory.value = category
  }

  function setSearchQuery(value) {
    searchQuery.value = value
  }

  function resetFilters() {
    activeCategory.value = 'Semua'
    searchQuery.value = ''
  }

  function getProductBySlug(slug) {
    return products.find((product) => product.slug === slug)
  }

  return {
    products,
    activeCategory,
    searchQuery,
    normalizedQuery,
    isSearching,
    isFiltering,
    featuredProducts,
    filteredProducts,
    resultCount,
    setCategory,
    setSearchQuery,
    resetFilters,
    getProductBySlug,
  }
})
