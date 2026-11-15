<script setup>
import { formatCurrency } from '@/composables/useCurrency'
import BaseBadge from '@/components/ui/BaseBadge.vue'

defineProps({
  product: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center gap-2">
      <BaseBadge variant="primary">{{ product.category }}</BaseBadge>
      <BaseBadge :variant="product.isAvailable ? 'success' : 'danger'">
        {{ product.isAvailable ? 'Tersedia' : 'Sedang habis' }}
      </BaseBadge>
    </div>

    <h1
      class="mt-3 text-[26px] font-bold leading-tight text-text-primary lg:text-[32px]"
    >
      {{ product.name }}
    </h1>

    <p class="mt-2 text-2xl font-bold leading-none text-primary lg:text-[28px]">
      {{ formatCurrency(product.price) }}
    </p>

    <div class="mt-6">
      <h2 class="text-base font-bold text-text-primary">Tentang Menu</h2>
      <p class="mt-2 text-sm leading-relaxed text-text-secondary">
        {{ product.description }}
      </p>
    </div>

    <p
      v-if="!product.isAvailable"
      class="mt-5 rounded-xl bg-primary-light px-4 py-3 text-sm font-medium text-primary"
      role="status"
    >
      Menu ini sedang habis. Silakan pilih menu lain atau simpan ke favorit.
    </p>
  </div>
</template>
