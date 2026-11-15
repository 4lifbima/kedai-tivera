<script setup>
import { formatCurrency } from '@/composables/useCurrency'
import BaseButton from '@/components/ui/BaseButton.vue'

defineProps({
  subtotal: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  uniqueItemCount: {
    type: Number,
    required: true,
  },
})

defineEmits(['checkout'])
</script>

<template>
  <aside
    class="rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-28"
    aria-labelledby="cart-summary-title"
  >
    <h2 id="cart-summary-title" class="text-lg font-bold text-text-primary">
      Ringkasan
    </h2>

    <dl class="mt-4 space-y-2 text-sm">
      <div class="flex items-center justify-between gap-4">
        <dt class="text-text-secondary">Subtotal ({{ uniqueItemCount }} menu)</dt>
        <dd class="font-medium text-text-primary">{{ formatCurrency(subtotal) }}</dd>
      </div>
      <div class="flex items-center justify-between gap-4">
        <dt class="text-text-secondary">Total item</dt>
        <dd class="font-medium text-text-primary">{{ totalItems }}</dd>
      </div>
    </dl>

    <div class="mt-4 flex items-end justify-between gap-4 border-t border-border pt-4">
      <span class="text-sm font-semibold text-text-primary">Total</span>
      <span class="text-2xl font-bold leading-none text-primary">
        {{ formatCurrency(subtotal) }}
      </span>
    </div>

    <BaseButton size="lg" class="mt-5 w-full" @click="$emit('checkout')">
      Checkout
    </BaseButton>

    <p class="mt-3 text-[11px] leading-relaxed text-text-secondary">
      Pesanan akan dibuat dengan kode unik. Tunjukkan kode tersebut ke kasir.
    </p>
  </aside>
</template>
