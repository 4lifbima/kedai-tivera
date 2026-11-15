<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import MainContainer from '@/components/layout/MainContainer.vue'
import CartItem from '@/components/cart/CartItem.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import CheckoutDialog from '@/components/cart/CheckoutDialog.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const cart = useCartStore()
const router = useRouter()
const isCheckoutOpen = ref(false)
</script>

<template>
  <MainContainer class="pb-28 lg:pb-16">
    <header class="flex flex-wrap items-end justify-between gap-3 pt-5 lg:pt-10">
      <div>
        <h1 class="text-[26px] font-bold text-text-primary">Keranjang</h1>
        <p class="mt-1 text-sm text-text-secondary">
          <template v-if="cart.uniqueItemCount">
            {{ cart.uniqueItemCount }} menu · {{ cart.totalItems }} item
          </template>
          <template v-else> Menu pilihanmu akan muncul di sini. </template>
        </p>
      </div>

      <RouterLink
        v-if="cart.uniqueItemCount"
        :to="{ name: 'home' }"
        class="rounded-full text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
      >
        Tambah Menu
      </RouterLink>
    </header>

    <div
      v-if="cart.uniqueItemCount"
      class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8"
    >
      <div class="space-y-3">
        <CartItem
          v-for="item in cart.detailedItems"
          :key="item.id"
          :item="item"
        />
      </div>

      <CartSummary
        :subtotal="cart.subtotal"
        :total-items="cart.totalItems"
        :unique-item-count="cart.uniqueItemCount"
        @checkout="isCheckoutOpen = true"
      />
    </div>

    <EmptyState
      v-else
      icon="cartLinear"
      title="Keranjangmu masih kosong."
      description="Tambahkan menu favoritmu dan atur jumlahnya di sini."
    >
      <BaseButton variant="primary" @click="router.push({ name: 'home' })">
        Jelajahi Menu
      </BaseButton>
    </EmptyState>
  </MainContainer>

  <CheckoutDialog
    v-if="isCheckoutOpen"
    :items="cart.detailedItems"
    :subtotal="cart.subtotal"
    @close="isCheckoutOpen = false"
  />
</template>
