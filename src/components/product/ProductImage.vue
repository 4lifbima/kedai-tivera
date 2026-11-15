<script setup>
import { computed, ref, watch } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  eager: {
    type: Boolean,
    default: false,
  },
  sizes: {
    type: String,
    default: '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw',
  },
  imgClass: {
    type: String,
    default: '',
  },
})

const failed = ref(false)

watch(
  () => props.src,
  () => {
    failed.value = false
  },
)

const srcset = computed(() => {
  if (!props.src.endsWith('.webp')) return undefined
  return `${props.src.replace('.webp', '-sm.webp')} 420w, ${props.src} 900w`
})
</script>

<template>
  <div class="h-full w-full bg-surface-secondary">
    <img
      v-if="!failed"
      :src="src"
      :srcset="srcset"
      :sizes="sizes"
      :alt="alt"
      width="900"
      height="900"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'auto'"
      decoding="async"
      class="h-full w-full object-contain object-center transition-transform duration-200"
      :class="imgClass"
      @error="failed = true"
    />
    <div
      v-else
      class="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center"
      role="img"
      :aria-label="alt"
    >
      <AppIcon name="forkKnife" :size="28" class="text-text-muted" />
      <span class="text-[11px] leading-snug text-text-secondary">Foto belum tersedia</span>
    </div>
  </div>
</template>
