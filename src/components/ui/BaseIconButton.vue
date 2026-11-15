<script setup>
import { computed } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'surface',
    validator: (value) => ['surface', 'ghost', 'primary', 'on-primary'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  toggle: {
    type: Boolean,
    default: false,
  },
  pressed: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const sizeClasses = {
  sm: 'h-10 w-10',
  md: 'h-10 w-10',
  lg: 'h-11 w-11',
}

const iconSizes = {
  sm: 18,
  md: 20,
  lg: 22,
}

const variantClasses = {
  surface:
    'border border-border bg-surface text-text-primary hover:bg-surface-secondary active:bg-border/60',
  ghost:
    'bg-transparent text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
  primary: 'bg-primary text-white hover:bg-primary-hover',
  'on-primary': 'bg-surface text-primary hover:bg-primary-light',
}

const classes = computed(() => [
  'inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40',
  sizeClasses[props.size],
  variantClasses[props.variant],
])
</script>

<template>
  <button
    type="button"
    :class="classes"
    :aria-label="label"
    :aria-pressed="toggle ? pressed : undefined"
    :disabled="disabled"
  >
    <AppIcon :name="name" :size="iconSizes[size]" />
    <slot />
  </button>
</template>
