<script setup>
import ProductCard from '@/components/catalog/ProductCard.vue'

defineProps({
  products: {
    type: Array,
    required: true,
  },
  eagerCount: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <div class="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-8">
    <ProductCard
      v-for="(product, index) in products"
      :key="product.id"
      :product="product"
      :priority="index < eagerCount"
    />
  </div>
</template>
