<script setup>
import { useId } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import ProductCard from '@/components/catalog/ProductCard.vue'
import ProductGrid from '@/components/catalog/ProductGrid.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  products: {
    type: Array,
    required: true,
  },
  scrollOnMobile: {
    type: Boolean,
    default: false,
  },
  viewAllLabel: {
    type: String,
    default: 'Lihat Semua',
  },
  showViewAll: {
    type: Boolean,
    default: true,
  },
})

defineEmits(['view-all'])

const titleId = useId()
</script>

<template>
  <section :aria-labelledby="titleId">
    <div class="flex items-baseline justify-between gap-4">
      <h2 :id="titleId" class="text-xl font-bold text-text-primary">
        {{ title }}
      </h2>
      <button
        v-if="showViewAll"
        type="button"
        class="inline-flex shrink-0 items-center gap-1 rounded-full text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
        @click="$emit('view-all')"
      >
        {{ viewAllLabel }}
        <AppIcon name="arrowRight" :size="16" />
      </button>
    </div>

    <div
      v-if="scrollOnMobile"
      class="-mx-5 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-1 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-8"
    >
      <ProductCard
        v-for="(product, index) in products"
        :key="product.id"
        :product="product"
        :priority="index < 2"
        class="w-[168px] shrink-0 snap-start sm:w-auto"
      />
    </div>

    <ProductGrid v-else :products="products" :eager-count="4" class="mt-4" />
  </section>
</template>
