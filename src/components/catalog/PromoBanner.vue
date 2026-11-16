<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'

const AUTOPLAY_DELAY = 6000
const SWIPE_THRESHOLD = 40

const slides = [
  {
    id: 'nasi-goreng',
    desktopImage: '/images/banners/banner-nasi-goreng.webp',
    mobileImage: '/images/banners/banner-nasi-goreng-mobile.webp',
    alt: 'Promo Menu Andalan Kedai Tivera: Nasi Goreng Spesial',
    to: { name: 'product-detail', params: { slug: 'nasi-goreng-spesial' } },
  },
  {
    id: 'paket-berdua',
    desktopImage: '/images/banners/banner-paket-berdua.webp',
    mobileImage: '/images/banners/banner-paket-berdua-mobile.webp',
    alt: 'Promo Hemat Berdua Kedai Tivera: Paket Hemat Berdua',
    to: { name: 'product-detail', params: { slug: 'paket-berdua' } },
  },
  {
    id: 'es-kopi-susu',
    desktopImage: '/images/banners/banner-kopi-susu.webp',
    mobileImage: '/images/banners/banner-kopi-susu-mobile.webp',
    alt: 'Promo Teman Santai Kedai Tivera: Es Kopi Susu Creamy',
    to: { name: 'product-detail', params: { slug: 'es-kopi-susu' } },
  },
]

const activeIndex = ref(0)
const transitionName = ref('banner-slide-next')
const userPaused = ref(false)
const interactionPaused = ref(false)
const reduceMotion = ref(false)

let autoplayTimer = null
let touchStartX = 0
let touchStartY = 0
let motionQuery = null

const activeSlide = computed(() => slides[activeIndex.value])
const isPaused = computed(() => userPaused.value)

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

function startAutoplay() {
  stopAutoplay()

  const shouldPlay =
    !userPaused.value &&
    !interactionPaused.value &&
    !reduceMotion.value &&
    !document.hidden

  if (!shouldPlay) return

  autoplayTimer = setInterval(() => {
    transitionName.value = 'banner-slide-next'
    activeIndex.value = (activeIndex.value + 1) % slides.length
  }, AUTOPLAY_DELAY)
}

function showSlide(index, direction) {
  const target = (index + slides.length) % slides.length
  if (target === activeIndex.value) return

  transitionName.value =
    direction ?? (target > activeIndex.value ? 'banner-slide-next' : 'banner-slide-prev')
  activeIndex.value = target
  startAutoplay()
}

function nextSlide() {
  showSlide(activeIndex.value + 1, 'banner-slide-next')
}

function prevSlide() {
  showSlide(activeIndex.value - 1, 'banner-slide-prev')
}

function toggleAutoplay() {
  userPaused.value = !userPaused.value
  startAutoplay()
}

function pauseForInteraction() {
  interactionPaused.value = true
  stopAutoplay()
}

function resumeAfterInteraction() {
  interactionPaused.value = false
  startAutoplay()
}

function handleFocusOut(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    resumeAfterInteraction()
  }
}

function handleTouchStart(event) {
  const touch = event.touches[0]
  if (!touch) return
  touchStartX = touch.clientX
  touchStartY = touch.clientY
  pauseForInteraction()
}

function handleTouchEnd(event) {
  const touch = event.changedTouches[0]
  if (touch) {
    const dx = touch.clientX - touchStartX
    const dy = touch.clientY - touchStartY
    if (Math.abs(dx) >= SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) nextSlide()
      else prevSlide()
    }
  }
  resumeAfterInteraction()
}

function handleKeydown(event) {
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    nextSlide()
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    prevSlide()
  }
}

function handleMotionChange(event) {
  reduceMotion.value = event.matches
  startAutoplay()
}

function preloadSlides() {
  const isDesktop = window.matchMedia('(min-width: 640px)').matches
  for (const slide of slides.slice(1)) {
    const img = new Image()
    img.src = isDesktop ? slide.desktopImage : slide.mobileImage
  }
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduceMotion.value = motionQuery.matches
  motionQuery.addEventListener('change', handleMotionChange)
  preloadSlides()
  startAutoplay()
  document.addEventListener('visibilitychange', startAutoplay)
})

onBeforeUnmount(() => {
  stopAutoplay()
  motionQuery?.removeEventListener('change', handleMotionChange)
  document.removeEventListener('visibilitychange', startAutoplay)
})
</script>

<template>
  <section
    class="w-full"
    aria-roledescription="carousel"
    aria-label="Promo pilihan Kedai Tivera"
    @mouseenter="pauseForInteraction"
    @mouseleave="resumeAfterInteraction"
    @focusin="pauseForInteraction"
    @focusout="handleFocusOut"
    @keydown="handleKeydown"
  >
    <div
      class="overflow-hidden rounded-xl bg-primary-dark shadow-card"
      @touchstart.passive="handleTouchStart"
      @touchend.passive="handleTouchEnd"
      @touchcancel.passive="resumeAfterInteraction"
    >
      <div class="grid overflow-hidden">
        <Transition :name="transitionName">
          <div
            :key="activeSlide.id"
            class="col-start-1 row-start-1 w-full"
            role="group"
            aria-roledescription="slide"
            :aria-label="`${activeIndex + 1} dari ${slides.length}`"
          >
            <RouterLink
              :to="activeSlide.to"
              :aria-label="activeSlide.alt"
              class="block aspect-video w-full rounded-xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sm:aspect-[16/5]"
            >
              <picture class="block h-full w-full">
                <source
                  media="(min-width: 640px)"
                  :srcset="activeSlide.desktopImage"
                  type="image/webp"
                  width="1920"
                  height="600"
                />
                <img
                  :src="activeSlide.mobileImage"
                  :alt="activeSlide.alt"
                  width="1024"
                  height="576"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  draggable="false"
                  class="block h-full w-full select-none object-cover"
                />
              </picture>
            </RouterLink>
          </div>
        </Transition>
      </div>
    </div>

    <div class="mt-2.5 flex items-center justify-between px-1">
      <div class="flex items-center gap-1" role="group" aria-label="Pilih banner">
        <button
          v-for="(slide, index) in slides"
          :key="slide.id"
          type="button"
          class="flex h-6 w-6 items-center justify-center rounded-full"
          :aria-label="`Tampilkan banner ${index + 1}: ${slide.alt}`"
          :aria-current="index === activeIndex ? 'true' : undefined"
          @click="showSlide(index)"
        >
          <span
            class="h-1.5 rounded-full transition-all duration-200"
            :class="
              index === activeIndex
                ? 'w-5 bg-primary'
                : 'w-1.5 bg-border hover:bg-text-muted'
            "
          />
        </button>
      </div>

      <button
        v-if="!reduceMotion"
        type="button"
        class="inline-flex h-7 w-7 items-center justify-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-secondary hover:text-text-primary"
        :aria-label="
          isPaused ? 'Putar otomatis banner' : 'Jeda otomatis banner'
        "
        :aria-pressed="isPaused"
        @click="toggleAutoplay"
      >
        <AppIcon :name="isPaused ? 'play' : 'pause'" :size="13" />
      </button>
    </div>
  </section>
</template>
