<script setup>
import { categories } from '@/data/categories'

defineProps({
  modelValue: {
    type: String,
    default: 'Semua',
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div
    class="-mx-5 overflow-x-auto px-5 no-scrollbar sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
    role="group"
    aria-label="Filter kategori"
  >
    <div class="flex w-max gap-2 pb-0.5">
      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        :aria-pressed="modelValue === category.label"
        class="h-10 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors duration-150"
        :class="
          modelValue === category.label
            ? 'border-primary bg-primary text-white'
            : 'border-border bg-surface text-text-primary hover:bg-surface-secondary'
        "
        @click="emit('update:modelValue', category.label)"
      >
        {{ category.label }}
      </button>
    </div>
  </div>
</template>
