<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const variantClasses = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:bg-primary-dark disabled:bg-text-muted/40 disabled:text-white/80',
  secondary:
    'border border-border bg-surface text-text-primary hover:bg-surface-secondary active:bg-border/60 disabled:text-text-muted',
  ghost:
    'bg-transparent text-text-primary hover:bg-surface-secondary active:bg-border/60 disabled:text-text-muted',
}

const sizeClasses = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-sm',
  lg: 'h-[52px] px-6 text-sm',
}

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 disabled:cursor-not-allowed',
  variantClasses[props.variant],
  sizeClasses[props.size],
])
</script>

<template>
  <button :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
