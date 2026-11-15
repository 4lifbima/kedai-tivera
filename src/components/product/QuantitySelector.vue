<script setup>
import { computed } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
  min: {
    type: Number,
    default: 1,
  },
  max: {
    type: Number,
    default: 99,
  },
  label: {
    type: String,
    default: 'Jumlah',
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const canDecrease = computed(() => !props.disabled && props.modelValue > props.min)
const canIncrease = computed(() => !props.disabled && props.modelValue < props.max)

const buttonClass = computed(() => [
  'relative flex items-center justify-center rounded-full text-text-primary transition-colors hover:bg-surface-secondary disabled:cursor-not-allowed disabled:text-text-muted',
  props.size === 'sm'
    ? "h-9 w-9 after:absolute after:-inset-0.5 after:content-['']"
    : 'h-10 w-10',
])

const valueClass = computed(() => [
  'text-center font-bold tabular-nums text-text-primary',
  props.size === 'sm' ? 'min-w-6 text-[13px]' : 'min-w-7 text-sm',
])

const iconSize = computed(() => (props.size === 'sm' ? 16 : 18))

function update(nextValue) {
  const value = Math.min(props.max, Math.max(props.min, nextValue))
  emit('update:modelValue', value)
}
</script>

<template>
  <div
    class="inline-flex items-center rounded-full border border-border bg-surface p-1"
    role="group"
    :aria-label="label"
  >
    <button
      type="button"
      :class="buttonClass"
      :disabled="!canDecrease"
      :aria-label="`Kurangi ${label.toLowerCase()}`"
      @click="update(modelValue - 1)"
    >
      <AppIcon name="minus" :size="iconSize" />
    </button>
    <span :class="valueClass" aria-live="polite">
      {{ modelValue }}
    </span>
    <button
      type="button"
      :class="buttonClass"
      :disabled="!canIncrease"
      :aria-label="`Tambah ${label.toLowerCase()}`"
      @click="update(modelValue + 1)"
    >
      <AppIcon name="add" :size="iconSize" />
    </button>
  </div>
</template>
