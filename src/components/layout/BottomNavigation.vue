<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import AppIcon from '@/components/ui/AppIcon.vue'

const cart = useCartStore()

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
  <div class="fixed inset-x-0 bottom-0 z-40 px-4 pb-safe lg:hidden">
    <nav
      class="mx-auto flex h-[68px] w-full max-w-md items-center justify-around rounded-full bg-primary px-2.5 shadow-nav"
      aria-label="Navigasi utama"
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
          :aria-label="item.name === 'cart' ? cartLabel : item.label"
          class="relative flex h-12 w-14 items-center justify-center rounded-full transition-colors duration-150"
          :class="
            isExactActive
              ? 'bg-white/15 text-white'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
          "
          @click="navigate"
        >
          <AppIcon
            :name="isExactActive ? item.activeIcon : item.icon"
            :size="23"
          />
          <span
            v-if="item.name === 'cart' && cart.totalItems > 0"
            class="absolute right-1.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold leading-none text-primary"
            aria-hidden="true"
          >
            {{ cart.totalItems }}
          </span>
        </a>
      </RouterLink>
    </nav>
  </div>
</template>
