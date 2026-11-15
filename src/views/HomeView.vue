<script setup>
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import { useFavoritesStore } from '@/stores/favorites'
import MainContainer from '@/components/layout/MainContainer.vue'
import PromoBanner from '@/components/catalog/PromoBanner.vue'
import SearchBar from '@/components/catalog/SearchBar.vue'
import CategoryFilter from '@/components/catalog/CategoryFilter.vue'
import ProductSection from '@/components/catalog/ProductSection.vue'
import ProductGrid from '@/components/catalog/ProductGrid.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const catalog = useCatalogStore()
const favorites = useFavoritesStore()
const router = useRouter()

const catalogSection = ref(null)

const isBrowsing = computed(() => !catalog.isFiltering)
const favoritePreview = computed(() => favorites.favoriteProducts.slice(0, 4))

const resultsTitle = computed(() => {
  if (catalog.isSearching) {
    return `Hasil untuk “${catalog.searchQuery.trim()}”`
  }
  if (catalog.activeCategory !== 'Semua') {
    return `Menu ${catalog.activeCategory}`
  }
  return 'Semua Menu'
})

const resultSummary = computed(
  () => `${catalog.resultCount} menu ditemukan`,
)

const emptyTitle = computed(() =>
  catalog.isSearching
    ? 'Menu yang kamu cari belum tersedia.'
    : 'Belum ada menu di kategori ini.',
)

const emptyDescription = computed(() =>
  catalog.isSearching
    ? 'Coba kata kunci lain atau lihat semua menu yang tersedia.'
    : 'Coba pilih kategori lain atau lihat seluruh katalog.',
)

function resetFilters() {
  catalog.resetFilters()
}

function scrollToCatalog() {
  catalog.resetFilters()
  nextTick(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    catalogSection.value?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  })
}

function goToFavorites() {
  router.push({ name: 'favorites' })
}
</script>

<template>
  <MainContainer class="pb-28 lg:pb-16">
    <section class="pt-5 lg:pt-10">
      <PromoBanner />

      <div class="mt-6 lg:mt-8 lg:flex lg:items-end lg:justify-between lg:gap-12">
        <div class="max-w-xl">
          <h1
            class="text-[28px] font-bold leading-[1.15] text-text-primary sm:text-[32px]"
          >
            Temukan Menu <span class="text-primary">Favoritmu</span>
          </h1>
          <p class="mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
            Pilihan makanan lezat untuk menemani harimu.
          </p>
        </div>

        <div class="mt-5 w-full lg:mt-0 lg:max-w-md">
          <SearchBar
            :model-value="catalog.searchQuery"
            @update:model-value="catalog.setSearchQuery"
          />
        </div>
      </div>

      <div class="mt-4 lg:mt-6">
        <CategoryFilter
          :model-value="catalog.activeCategory"
          @update:model-value="catalog.setCategory"
        />
      </div>
    </section>

    <ProductSection
      v-if="isBrowsing"
      title="Menu Populer"
      :products="catalog.featuredProducts"
      scroll-on-mobile
      class="mt-8 lg:mt-10"
      @view-all="scrollToCatalog"
    />

    <ProductSection
      v-if="isBrowsing && favoritePreview.length"
      title="Menu Favoritmu"
      :products="favoritePreview"
      view-all-label="Kelola Favorit"
      class="mt-10 lg:mt-14"
      @view-all="goToFavorites"
    />

    <section
      id="semua-menu"
      ref="catalogSection"
      class="mt-10 scroll-mt-24 lg:mt-14"
      aria-labelledby="catalog-heading"
    >
      <div class="flex items-end justify-between gap-4">
        <div>
          <h2 id="catalog-heading" class="text-xl font-bold text-text-primary">
            {{ resultsTitle }}
          </h2>
          <p class="mt-1 text-xs font-medium text-text-secondary">
            {{ resultSummary }}
          </p>
        </div>
        <button
          v-if="catalog.isFiltering"
          type="button"
          class="rounded-full px-1 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          @click="resetFilters"
        >
          Reset
        </button>
      </div>

      <p
        v-if="catalog.isFiltering"
        class="sr-only"
        role="status"
        aria-live="polite"
      >
        {{ resultSummary }}
      </p>

      <ProductGrid
        v-if="catalog.filteredProducts.length"
        :products="catalog.filteredProducts"
        class="mt-4"
      />

      <EmptyState
        v-else
        :icon="catalog.isSearching ? 'search' : 'bag'"
        :title="emptyTitle"
        :description="emptyDescription"
      >
        <BaseButton variant="primary" @click="resetFilters">
          Lihat Semua Menu
        </BaseButton>
      </EmptyState>
    </section>
  </MainContainer>
</template>
