<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { icons } from '@/icons'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 24,
  },
})

const iconData = computed(() => icons[props.name] ?? icons.info)
</script>

<template>
  <Icon
    :icon="iconData"
    :width="size"
    :height="size"
    aria-hidden="true"
    focusable="false"
  />
</template>
