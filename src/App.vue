<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomNavigation from '@/components/layout/BottomNavigation.vue'
import ToastHost from '@/components/ui/ToastHost.vue'

const route = useRoute()

const isProductDetail = computed(() => route.name === 'product-detail')
</script>

<template>
  <a href="#main-content" class="skip-link">Lewati ke konten utama</a>

  <div class="flex min-h-dvh flex-col">
    <AppHeader :class="isProductDetail ? 'hidden lg:block' : ''" />

    <main id="main-content" tabindex="-1" class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <div :key="route.path">
            <component :is="Component" />
          </div>
        </Transition>
      </RouterView>
    </main>
  </div>

  <BottomNavigation v-if="!isProductDetail" />
  <ToastHost />
</template>
