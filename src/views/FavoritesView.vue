<script setup>
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'
import MainContainer from '@/components/layout/MainContainer.vue'
import ProductGrid from '@/components/catalog/ProductGrid.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const favorites = useFavoritesStore()
const router = useRouter()
</script>

<template>
  <MainContainer class="pb-28 lg:pb-16">
    <header class="pt-5 lg:pt-10">
      <h1 class="text-[26px] font-bold text-text-primary">Favorit</h1>
      <p class="mt-1 text-sm text-text-secondary">
        <template v-if="favorites.count">
          {{ favorites.count }} menu yang kamu simpan.
        </template>
        <template v-else> Menu yang kamu simpan akan muncul di sini. </template>
      </p>
    </header>

    <ProductGrid
      v-if="favorites.count"
      :products="favorites.favoriteProducts"
      :eager-count="4"
      class="mt-6"
    />

    <EmptyState
      v-else
      icon="heartLinear"
      title="Belum ada menu favorit."
      description="Tekan ikon hati pada menu yang kamu suka untuk menyimpannya di sini."
      class="mt-4"
    >
      <BaseButton variant="primary" @click="router.push({ name: 'home' })">
        Jelajahi Menu
      </BaseButton>
    </EmptyState>
  </MainContainer>
</template>
