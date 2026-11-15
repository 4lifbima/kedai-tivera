<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'

defineProps({
  icon: {
    type: String,
    default: 'bag',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="flex flex-col items-center px-6 py-12 text-center">
    <span
      class="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary"
    >
      <AppIcon :name="icon" :size="26" />
    </span>
    <h2 class="mt-4 text-lg font-bold text-text-primary">{{ title }}</h2>
    <p v-if="description" class="mt-1.5 max-w-sm text-sm leading-relaxed text-text-secondary">
      {{ description }}
    </p>
    <div v-if="$slots.default" class="mt-5">
      <slot />
    </div>
  </div>
</template>
