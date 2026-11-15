<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

function handleInput(event) {
  emit('update:modelValue', event.target.value)
}

function clearSearch() {
  emit('update:modelValue', '')
}
</script>

<template>
  <form role="search" class="w-full" @submit.prevent>
    <label for="catalog-search" class="sr-only">Cari menu</label>
    <div
      class="flex h-[54px] items-center gap-3 rounded-full border border-border bg-surface pl-4 pr-2 shadow-card transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 sm:h-14"
    >
      <AppIcon name="search" :size="20" class="shrink-0 text-text-muted" />
      <input
        id="catalog-search"
        :value="props.modelValue"
        type="search"
        placeholder="Cari menu favoritmu..."
        autocomplete="off"
        autocapitalize="none"
        spellcheck="false"
        class="h-full min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
        @input="handleInput"
      />
      <button
        v-if="props.modelValue"
        type="button"
        aria-label="Hapus pencarian"
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
        @click="clearSearch"
      >
        <AppIcon name="close" :size="18" />
      </button>
    </div>
  </form>
</template>
