<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'neutral',
    validator: (value) =>
      ['primary', 'neutral', 'success', 'warning', 'danger'].includes(value),
  },
})

const variantClasses = {
  primary: 'bg-primary-light text-primary',
  neutral: 'bg-surface-secondary text-text-secondary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
}

const classes = computed(() => [
  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none',
  variantClasses[props.variant],
])
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
