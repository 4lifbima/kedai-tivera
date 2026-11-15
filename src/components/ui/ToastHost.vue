<script setup>
import { useUiStore } from '@/stores/ui'
import AppIcon from '@/components/ui/AppIcon.vue'

const ui = useUiStore()

const icons = {
  success: 'check',
  info: 'info',
  warning: 'danger',
  danger: 'danger',
}

const colors = {
  success: 'text-success',
  info: 'text-info',
  warning: 'text-warning',
  danger: 'text-danger',
}
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-4 bottom-[calc(6.5rem+env(safe-area-inset-bottom))] z-50 flex flex-col items-center gap-2 lg:inset-x-auto lg:bottom-6 lg:right-6 lg:items-end"
    role="status"
    aria-live="polite"
  >
    <TransitionGroup name="toast" tag="div" class="contents">
      <div
        v-for="toast in ui.toasts"
        :key="toast.id"
        class="flex w-full max-w-sm items-start gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sheet"
      >
        <AppIcon
          :name="icons[toast.type] ?? icons.info"
          :size="18"
          :class="['mt-0.5 shrink-0', colors[toast.type] ?? colors.info]"
        />
        <p class="text-[13px] leading-snug text-text-primary">{{ toast.message }}</p>
      </div>
    </TransitionGroup>
  </div>
</template>
