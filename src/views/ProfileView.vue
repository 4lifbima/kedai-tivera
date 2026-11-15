<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'
import MainContainer from '@/components/layout/MainContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const favorites = useFavoritesStore()
const cart = useCartStore()
const ui = useUiStore()

const confirmingReset = ref(false)

function resetLocalData() {
  favorites.clearFavorites()
  cart.clearCart()
  confirmingReset.value = false
  ui.showToast('Favorit dan keranjang berhasil dihapus.', 'info')
}
</script>

<template>
  <MainContainer class="pb-28 lg:pb-16">
    <header class="pt-5 lg:pt-10">
      <h1 class="text-[26px] font-bold text-text-primary">Profil</h1>
      <p class="mt-1 text-sm text-text-secondary">
        Ringkasan aktivitas dan pengaturan katalogmu.
      </p>
    </header>

    <div class="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-8">
      <div class="space-y-6">
        <section
          class="rounded-2xl border border-border bg-surface p-5 sm:p-6"
          aria-labelledby="profile-identity-title"
        >
          <div class="flex items-center gap-4">
            <span
              class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-extrabold text-white"
            >
              KT
            </span>
            <div class="min-w-0">
              <h2 id="profile-identity-title" class="text-lg font-bold text-text-primary">
                Tamu
              </h2>
              <p class="mt-0.5 text-sm leading-relaxed text-text-secondary">
                Kamu menjelajah sebagai tamu. Tidak perlu akun untuk melihat menu.
              </p>
            </div>
          </div>

          <div class="mt-5 grid grid-cols-2 gap-3">
            <RouterLink
              :to="{ name: 'favorites' }"
              class="rounded-xl bg-surface-secondary p-4 transition-colors hover:bg-primary-light"
            >
              <span class="flex items-center gap-2 text-text-secondary">
                <AppIcon name="heartBold" :size="18" class="text-primary" />
                <span class="text-xs font-semibold">Favorit</span>
              </span>
              <span class="mt-2 block text-xl font-bold text-text-primary">
                {{ favorites.count }}
              </span>
              <span class="text-[11px] text-text-secondary">menu tersimpan</span>
            </RouterLink>

            <RouterLink
              :to="{ name: 'cart' }"
              class="rounded-xl bg-surface-secondary p-4 transition-colors hover:bg-primary-light"
            >
              <span class="flex items-center gap-2 text-text-secondary">
                <AppIcon name="cartBold" :size="18" class="text-primary" />
                <span class="text-xs font-semibold">Keranjang</span>
              </span>
              <span class="mt-2 block text-xl font-bold text-text-primary">
                {{ cart.totalItems }}
              </span>
              <span class="text-[11px] text-text-secondary">item dipilih</span>
            </RouterLink>
          </div>
        </section>

        <section
          class="rounded-2xl border border-border bg-surface p-5 sm:p-6"
          aria-labelledby="about-title"
        >
          <h2 id="about-title" class="text-base font-bold text-text-primary">
            Tentang Kedai Tivera
          </h2>
          <p class="mt-2 text-sm leading-relaxed text-text-secondary">
            Kedai Tivera adalah katalog menu makanan rumahan. Jelajahi pilihan
            menu, simpan favoritmu, dan siapkan pesanan dengan mudah.
          </p>
          <a
            href="https://www.pexels.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover"
          >
            <AppIcon name="info" :size="15" />
            Foto menu: Pexels
          </a>
        </section>
      </div>

      <section
        class="h-fit rounded-2xl border border-border bg-surface p-5 sm:p-6"
        aria-labelledby="data-title"
      >
        <h2 id="data-title" class="text-base font-bold text-text-primary">
          Data di Perangkat
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-text-secondary">
          Favorit dan keranjang disimpan di browser ini. Kamu bisa menghapusnya
          kapan saja tanpa memengaruhi menu yang tersedia.
        </p>

        <div v-if="!confirmingReset" class="mt-4">
          <BaseButton
            variant="secondary"
            size="sm"
            @click="confirmingReset = true"
          >
            <AppIcon name="refresh" :size="17" />
            Hapus Data Lokal
          </BaseButton>
        </div>

        <div
          v-else
          class="mt-4 rounded-xl bg-primary-light p-4"
          role="alert"
          aria-live="polite"
        >
          <p class="text-sm font-medium text-primary">
            Semua favorit dan isi keranjang akan dihapus.
          </p>
          <div class="mt-3 flex gap-2">
            <BaseButton
              variant="secondary"
              size="sm"
              @click="confirmingReset = false"
            >
              Batal
            </BaseButton>
            <BaseButton size="sm" @click="resetLocalData">
              Ya, Hapus
            </BaseButton>
          </div>
        </div>

        <p class="mt-6 border-t border-border pt-4 text-[11px] text-text-secondary">
          Kedai Tivera · Katalog Menu
        </p>
      </section>
    </div>
  </MainContainer>
</template>
