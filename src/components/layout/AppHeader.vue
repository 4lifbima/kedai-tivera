<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import AppIcon from '@/components/ui/AppIcon.vue'
import NavigationMenu from '@/components/layout/NavigationMenu.vue'

const cart = useCartStore()
const menuOpen = ref(false)

const navItems = [
  { name: 'home', label: 'Beranda', icon: 'homeLinear', activeIcon: 'homeBold' },
  { name: 'favorites', label: 'Favorit', icon: 'heartLinear', activeIcon: 'heartBold' },
  {
    name: 'cart',
    label: 'Keranjang',
    icon: 'cartLinear',
    activeIcon: 'cartBold',
  },
  { name: 'profile', label: 'Profil', icon: 'userLinear', activeIcon: 'userBold' },
]

const cartLabel = computed(() =>
  cart.totalItems > 0
    ? `Keranjang, ${cart.totalItems} item`
    : 'Keranjang',
)
</script>

<template>
  <header class="z-40 border-b border-border bg-background lg:sticky lg:top-0">
    <div
      class="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-6 lg:h-20 lg:px-8"
    >
      <RouterLink
        :to="{ name: 'home' }"
        class="flex items-center gap-2.5 rounded-xl"
        aria-label="Kedai Tivera, kembali ke beranda"
      >
      <img
        src="/icon/tivera-icon.png"
        alt="Logo Kedai Tivera"
        class="h-8 w-auto lg:h-10"
      />
      </RouterLink>

      <div class="flex items-center gap-2 sm:gap-3">
        <nav
          class="hidden items-center gap-1 lg:flex"
          aria-label="Navigasi utama desktop"
        >
          <RouterLink
            v-for="item in navItems"
            :key="item.name"
            :to="{ name: item.name }"
            custom
            v-slot="{ href, navigate, isExactActive }"
          >
            <a
              :href="href"
              :aria-current="isExactActive ? 'page' : undefined"
              :aria-label="
                item.name === 'cart' ? cartLabel : item.label
              "
              class="inline-flex h-10 items-center gap-2 rounded-full px-3.5 text-sm font-semibold transition-colors duration-150"
              :class="
                isExactActive
                  ? 'bg-primary-light text-primary'
                  : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
              "
              @click="navigate"
            >
              <AppIcon
                :name="isExactActive ? item.activeIcon : item.icon"
                :size="19"
              />
              <span>{{ item.label }}</span>
              <span
                v-if="item.name === 'cart' && cart.totalItems > 0"
                class="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold leading-none text-white"
              >
                {{ cart.totalItems }}
              </span>
            </a>
          </RouterLink>
        </nav>

        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white transition-colors duration-150 bg-red-700"
          aria-label="Buka menu navigasi"
          aria-haspopup="dialog"
          :aria-controls="menuOpen ? 'app-menu' : undefined"
          :aria-expanded="menuOpen"
          @click="menuOpen = true"
        >
          <AppIcon name="menu" :size="20" />
        </button>
      </div>
    </div>

    <NavigationMenu v-if="menuOpen" @close="menuOpen = false" />
  </header>
</template>
