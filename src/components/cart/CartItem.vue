<script setup>
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'
import { formatCurrency } from '@/composables/useCurrency'
import ProductImage from '@/components/product/ProductImage.vue'
import QuantitySelector from '@/components/product/QuantitySelector.vue'
import BaseIconButton from '@/components/ui/BaseIconButton.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const cart = useCartStore()
const ui = useUiStore()

function increment() {
  cart.increment(props.item.id)
}

function decrement() {
  cart.decrement(props.item.id)
}

function removeItem() {
  cart.removeItem(props.item.id)
  ui.showToast(`${props.item.name} dihapus dari keranjang.`, 'info')
}
</script>

<template>
  <article
    class="flex gap-2.5 rounded-2xl border border-border bg-surface p-3 sm:gap-3 sm:p-4"
  >
    <RouterLink
      :to="{ name: 'product-detail', params: { slug: item.slug } }"
      class="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-secondary sm:h-20 sm:w-20"
      :aria-label="`Lihat detail ${item.name}`"
    >
      <ProductImage
        :src="item.image"
        :alt="`${item.name}, ${item.category}`"
        sizes="80px"
      />
    </RouterLink>

    <div class="flex min-w-0 flex-1 flex-col">
      <div class="flex items-start justify-between gap-1">
        <div class="min-w-0">
          <RouterLink
            :to="{ name: 'product-detail', params: { slug: item.slug } }"
            class="line-clamp-2 text-sm font-bold leading-snug text-text-primary hover:text-primary"
          >
            {{ item.name }}
          </RouterLink>
          <p class="mt-0.5 text-[11px] font-medium text-text-secondary">
            {{ item.category }} · {{ formatCurrency(item.price) }}
          </p>
        </div>

        <BaseIconButton
          name="trash"
          :label="`Hapus ${item.name} dari keranjang`"
          variant="ghost"
          size="sm"
          class="-mr-1 -mt-1"
          @click="removeItem"
        />
      </div>

      <div class="mt-auto flex items-end justify-between gap-2 pt-2">
        <QuantitySelector
          :model-value="item.quantity"
          :label="`Jumlah ${item.name}`"
          size="sm"
          @update:model-value="cart.setQuantity(item.id, $event)"
        />
        <span class="shrink-0 text-sm font-bold leading-none text-primary">
          {{ formatCurrency(item.subtotal) }}
        </span>
      </div>
    </div>
  </article>
</template>
