<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'
import { useProductActions } from '@/composables/useProductActions'
import { formatCurrency } from '@/composables/useCurrency'
import ProductImage from '@/components/product/ProductImage.vue'
import BaseIconButton from '@/components/ui/BaseIconButton.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  priority: {
    type: Boolean,
    default: false,
  },
})

const favorites = useFavoritesStore()
const { addToCart, toggleFavorite } = useProductActions()

const isFavorite = computed(() => favorites.isFavorite(props.product.id))
const imageAlt = computed(() => `${props.product.name}, ${props.product.category}`)
const detailRoute = computed(() => ({
  name: 'product-detail',
  params: { slug: props.product.slug },
}))
</script>

<template>
  <article class="group relative h-full">
    <RouterLink
      :to="detailRoute"
      class="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow duration-200 hover:shadow-card"
    >
      <div class="relative aspect-square overflow-hidden bg-surface-secondary">
        <ProductImage
          :src="product.image"
          :alt="imageAlt"
          :eager="priority"
          img-class="motion-safe:group-hover:scale-[1.03]"
          :class="!product.isAvailable ? 'opacity-60' : ''"
        />
        <span
          v-if="!product.isAvailable"
          class="absolute left-2.5 top-2.5 rounded-full bg-surface px-2.5 py-1 text-[10px] font-bold leading-none text-danger"
        >
          Habis
        </span>
      </div>

      <div class="flex flex-1 flex-col p-2.5 sm:p-3">
        <h3
          class="line-clamp-2 min-h-10 text-[15px] font-bold leading-snug text-text-primary"
        >
          {{ product.name }}
        </h3>
        <p class="mt-0.5 text-[11px] font-medium text-text-secondary">
          {{ product.category }}
        </p>
        <div
          class="mt-auto flex items-end justify-between gap-2 pt-2.5 pr-9 sm:pr-10"
        >
          <span
            class="whitespace-nowrap text-sm font-bold leading-none text-primary lg:text-base"
          >
            {{ formatCurrency(product.price) }}
          </span>
        </div>
      </div>
    </RouterLink>

    <BaseIconButton
      :name="isFavorite ? 'heartBold' : 'heartLinear'"
      :label="
        isFavorite
          ? `Hapus ${product.name} dari favorit`
          : `Simpan ${product.name} ke favorit`
      "
      :pressed="isFavorite"
      toggle
      size="md"
      class="absolute right-2.5 top-2.5 z-10"
      :class="isFavorite ? 'text-primary' : ''"
      @click="toggleFavorite(product)"
    />

    <BaseIconButton
      name="add"
      :label="
        product.isAvailable
          ? `Tambah ${product.name} ke keranjang`
          : `${product.name} sedang habis`
      "
      variant="primary"
      size="md"
      :disabled="!product.isAvailable"
      class="absolute bottom-2.5 right-2.5 z-10 sm:bottom-3 sm:right-3"
      @click="addToCart(product)"
    />
  </article>
</template>
