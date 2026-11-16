<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseIconButton from '@/components/ui/BaseIconButton.vue'

const emit = defineEmits(['close'])

const router = useRouter()
const catalog = useCatalogStore()

const dialog = ref(null)
const closeButton = ref(null)
const query = ref(catalog.searchQuery)

const menuGroups = [
  {
    id: 'jelajahi',
    label: 'Jelajahi',
    items: [
      { label: 'Semua Menu', icon: 'gridBoldduotone', category: 'Semua' },
      { label: 'Makanan', icon: 'chefHatBoldduotone', category: 'Makanan' },
      { label: 'Snack', icon: 'donutBoldduotone', category: 'Snack' },
      { label: 'Minuman', icon: 'cupHotBoldduotone', category: 'Minuman' },
      { label: 'Paket', icon: 'giftBoldduotone', category: 'Paket' },
      { label: 'Favorit', icon: 'heartBoldduotone', to: { name: 'favorites' } },
    ],
  },
  {
    id: 'akun',
    label: 'Akun & Bantuan',
    items: [
      { label: 'Keranjang', icon: 'cartBoldduotone', to: { name: 'cart' } },
      { label: 'Profil', icon: 'userBoldduotone', to: { name: 'profile' } },
      {
        label: 'WhatsApp',
        icon: 'chatBoldduotone',
        href: 'https://wa.me/6281234567890',
      },
    ],
  },
]

onMounted(() => {
  dialog.value?.showModal()
  document.body.classList.add('overflow-hidden')
  nextTick(() => closeButton.value?.$el?.focus())
})

onUnmounted(() => {
  document.body.classList.remove('overflow-hidden')
})

function closeDialog() {
  document.body.classList.remove('overflow-hidden')
  dialog.value?.close()
}

function handleClosed() {
  document.body.classList.remove('overflow-hidden')
  emit('close')
}

function handleBackdropClick(event) {
  if (event.target === dialog.value) {
    closeDialog()
  }
}

function navigateTo(target) {
  closeDialog()
  router.push(target)
}

function openCategory(category) {
  catalog.setCategory(category)
  catalog.setSearchQuery('')
  navigateTo({ name: 'home', hash: '#semua-menu' })
}

function submitSearch() {
  catalog.setCategory('Semua')
  catalog.setSearchQuery(query.value.trim())
  navigateTo({ name: 'home', hash: '#semua-menu' })
}
</script>

<template>
  <dialog
    id="app-menu"
    ref="dialog"
    class="menu-sheet fixed inset-x-0 top-0 m-0 w-full max-w-none overflow-hidden rounded-b-[28px] border-0 bg-surface p-0 text-text-primary shadow-sheet sm:top-6 sm:mx-auto sm:w-[calc(100%-2rem)] sm:max-w-[560px] sm:rounded-[28px]"
    aria-labelledby="app-menu-title"
    @cancel.prevent="closeDialog"
    @close="handleClosed"
    @click="handleBackdropClick"
  >
    <div class="max-h-[92dvh] overflow-y-auto px-5 pb-7 sm:max-h-[85dvh] sm:px-6">
      <h2 id="app-menu-title" class="sr-only">Menu navigasi</h2>

      <div
        class="sticky top-0 z-10 -mx-5 flex items-center justify-between bg-surface px-5 pb-1 pt-4 sm:-mx-6 sm:px-6"
      >
        <span
          class="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-secondary"
        >
          Menu
        </span>
        <BaseIconButton
          ref="closeButton"
          name="closeBoldduotone"
          label="Tutup menu"
          variant="ghost"
          size="sm"
          class="-mr-1"
          @click="closeDialog"
        />
      </div>

      <form class="mt-2" role="search" @submit.prevent="submitSearch">
        <label for="menu-search" class="sr-only">Cari menu</label>
        <div
          class="flex h-12 items-center gap-1.5 rounded-full border border-border bg-surface pl-4 pr-1.5 transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10"
        >
          <input
            id="menu-search"
            v-model="query"
            type="search"
            placeholder="Mau makan apa hari ini?"
            autocomplete="off"
            autocapitalize="none"
            spellcheck="false"
            class="h-full min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
          />
          <button
            type="submit"
            aria-label="Cari menu"
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-secondary hover:text-primary"
          >
            <AppIcon name="searchBoldduotone" :size="20" />
          </button>
        </div>
      </form>

      <div
        v-for="group in menuGroups"
        :key="group.id"
        class="mt-6"
      >
        <h3
          class="px-1 text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary"
        >
          {{ group.label }}
        </h3>

        <div class="mt-3 grid grid-cols-3 gap-2.5 sm:gap-3">
          <template v-for="item in group.items" :key="item.label">
            <RouterLink
              v-if="item.to"
              :to="item.to"
              class="group flex min-h-[92px] flex-col items-center justify-center rounded-2xl border border-border bg-surface px-1.5 py-3 text-center transition-colors duration-150 hover:border-primary/30 hover:bg-primary-light"
              @click="closeDialog"
            >
              <span
                class="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary transition-colors duration-150 group-hover:bg-surface"
              >
                <AppIcon :name="item.icon" :size="24" />
              </span>
              <span class="mt-2 text-[11px] font-semibold text-text-primary sm:text-xs">
                {{ item.label }}
              </span>
            </RouterLink>

            <a
              v-else-if="item.href"
              :href="item.href"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex min-h-[92px] flex-col items-center justify-center rounded-2xl border border-border bg-surface px-1.5 py-3 text-center transition-colors duration-150 hover:border-primary/30 hover:bg-primary-light"
              @click="closeDialog"
            >
              <span
                class="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary transition-colors duration-150 group-hover:bg-surface"
              >
                <AppIcon :name="item.icon" :size="24" />
              </span>
              <span class="mt-2 text-[11px] font-semibold text-text-primary sm:text-xs">
                {{ item.label }}
              </span>
            </a>

            <button
              v-else
              type="button"
              class="group flex min-h-[92px] flex-col items-center justify-center rounded-2xl border border-border bg-surface px-1.5 py-3 text-center transition-colors duration-150 hover:border-primary/30 hover:bg-primary-light"
              @click="openCategory(item.category)"
            >
              <span
                class="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary transition-colors duration-150 group-hover:bg-surface"
              >
                <AppIcon :name="item.icon" :size="24" />
              </span>
              <span class="mt-2 text-[11px] font-semibold text-text-primary sm:text-xs">
                {{ item.label }}
              </span>
            </button>
          </template>
        </div>
      </div>

      <p class="mt-6 border-t border-border pt-4 text-[11px] leading-relaxed text-text-secondary">
        Pilih kategori untuk langsung membuka katalog, atau cari menu favoritmu.
      </p>
    </div>
  </dialog>
</template>
