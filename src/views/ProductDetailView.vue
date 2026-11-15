<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import { useFavoritesStore } from '@/stores/favorites'
import { useProductActions } from '@/composables/useProductActions'
import { formatCurrency } from '@/composables/useCurrency'
import MainContainer from '@/components/layout/MainContainer.vue'
import ProductImage from '@/components/product/ProductImage.vue'
import ProductInformation from '@/components/product/ProductInformation.vue'
import QuantitySelector from '@/components/product/QuantitySelector.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIconButton from '@/components/ui/BaseIconButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const route = useRoute()
const router = useRouter()
const catalog = useCatalogStore()
const favorites = useFavoritesStore()
const { addToCart, toggleFavorite } = useProductActions()

const quantity = ref(1)

const product = computed(() => catalog.getProductBySlug(route.params.slug))
const isFavorite = computed(() =>
  product.value ? favorites.isFavorite(product.value.id) : false,
)
const total = computed(() => (product.value?.price ?? 0) * quantity.value)

watch(
  () => route.params.slug,
  () => {
    quantity.value = 1
  },
)

watchEffect(() => {
  document.title = product.value
    ? `${product.value.name} — Kedai Tivera`
    : 'Menu tidak ditemukan — Kedai Tivera'
})

function goBack() {
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push({ name: 'home' })
  }
}

function handleAddToCart() {
  addToCart(product.value, quantity.value)
}
</script>

<template>
  <MainContainer v-if="!product" class="pb-28 lg:pb-16">
    <div class="pt-5">
      <BaseButton variant="secondary" size="sm" @click="goBack">
        <AppIcon name="back" :size="18" />
        Kembali
      </BaseButton>
    </div>

    <EmptyState
      icon="search"
      title="Menu tidak ditemukan"
      description="Menu yang kamu cari tidak tersedia atau sudah dipindahkan."
    >
      <BaseButton variant="primary" @click="router.push({ name: 'home' })">
        Kembali ke Katalog
      </BaseButton>
    </EmptyState>
  </MainContainer>

  <div v-else class="bg-primary lg:bg-background">
    <MainContainer class="pt-4 lg:pt-8">
      <div class="flex h-11 items-center justify-between gap-3">
        <button
          type="button"
          class="inline-flex h-11 items-center gap-2 rounded-full bg-surface px-3.5 text-sm font-semibold text-text-primary transition-colors hover:bg-primary-light"
          @click="goBack"
        >
          <AppIcon name="back" :size="20" />
          <span class="hidden sm:inline">Kembali</span>
          <span class="sr-only sm:hidden">Kembali</span>
        </button>

        <RouterLink
          :to="{ name: 'home' }"
          class="text-[11px] font-extrabold tracking-[0.18em] text-white lg:hidden"
        >
          <img 
            src="/icon/icon-white.png"
            alt="Kedai Tivera"
            class="h-8 w-auto lg:h-5"
          />
        </RouterLink>

        <BaseIconButton
          :name="isFavorite ? 'heartBold' : 'heartLinear'"
          :label="
            isFavorite
              ? `Hapus ${product.name} dari favorit`
              : `Simpan ${product.name} ke favorit`
          "
          variant="on-primary"
          size="lg"
          toggle
          :pressed="isFavorite"
          class="shadow-card"
          @click="toggleFavorite(product)"
        />
      </div>

      <div class="mt-4 grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-12">
        <div class="lg:sticky lg:top-28">
          <div class="rounded-[2rem] bg-primary p-3 sm:p-5">
            <div
              class="aspect-square overflow-hidden rounded-[1.4rem] bg-surface-secondary"
            >
              <ProductImage
                :src="product.image"
                :alt="`${product.name}, ${product.category}`"
                eager
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>

        <div
          class="-mx-5 rounded-t-[2rem] bg-surface px-5 pt-6 pb-28 sm:-mx-6 sm:px-7 lg:mx-0 lg:rounded-[2rem] lg:border lg:border-border lg:p-8"
        >
          <ProductInformation :product="product" />

          <div class="mt-6 border-t border-border pt-5">
            <div class="flex items-center justify-between gap-4">
              <span class="text-sm font-semibold text-text-primary">Jumlah</span>
              <QuantitySelector
                v-model="quantity"
                :label="`Jumlah ${product.name}`"
                :max="99"
                :disabled="!product.isAvailable"
              />
            </div>

            <div class="mt-4 flex items-center justify-between gap-4">
              <span class="text-sm text-text-secondary">Total</span>
              <span class="text-xl font-bold leading-none text-primary">
                {{ formatCurrency(total) }}
              </span>
            </div>

            <div class="mt-5 hidden lg:block">
              <BaseButton
                size="lg"
                class="w-full"
                :disabled="!product.isAvailable"
                @click="handleAddToCart"
              >
                <AppIcon name="cartLinear" :size="20" />
                {{ product.isAvailable ? 'Tambah ke Keranjang' : 'Stok Habis' }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </MainContainer>
  </div>

  <div
    v-if="product"
    class="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface px-4 pt-3 pb-safe lg:hidden"
  >
    <div class="mx-auto flex max-w-md items-center gap-2">
      <a
        class="flex border rounded-full bg-green-700 text-white px-4 py-3 gap-1 items-center justify-center text-sm font-semibold transition-colors hover:bg-green-800"
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/icon/whatsapp.png" alt="WhatsApp" class="w-5 h-5" />
        Pesan
    </a>
      <BaseButton
        class="min-w-0 flex-1"
        :disabled="!product.isAvailable"
        @click="handleAddToCart"
      >
        <AppIcon name="cartLinear" :size="18" />
        {{ product.isAvailable ? 'Tambah' : 'Stok Habis' }}
      </BaseButton>
    </div>
  </div>
</template>
