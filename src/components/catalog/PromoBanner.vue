<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'

const AUTOPLAY_DELAY = 6000

const slides = [
  {
    id: 'nasi-goreng',
    eyebrow: 'Menu Andalan',
    title: 'Nasi goreng spesial',
    description:
      'Telur mata sapi, ayam goreng, dan bumbu rumahan yang gurih.',
    image: '/images/products/nasi-goreng.webp',
    alt: 'Nasi goreng spesial dengan telur dan ayam goreng',
    to: { name: 'product-detail', params: { slug: 'nasi-goreng-spesial' } },
    cta: 'Lihat Menu',
  },
  {
    id: 'paket-berdua',
    eyebrow: 'Hemat Berdua',
    title: 'Hemat paket berdua',
    description: 'Aneka lauk, nasi, dan sayur untuk dua orang.',
    image: '/images/products/paket-berdua.webp',
    alt: 'Paket berdua berisi aneka lauk, nasi, dan sayur',
    to: { name: 'product-detail', params: { slug: 'paket-berdua' } },
    cta: 'Pesan Paket',
  },
  {
    id: 'es-kopi-susu',
    eyebrow: 'Teman Santai',
    title: 'Es kopi susu creamy',
    description: 'Espresso, susu, dan es batu untuk jeda di tengah hari.',
    image: '/images/products/kopi-susu.webp',
    alt: 'Es kopi susu dalam gelas dengan es batu',
    to: { name: 'product-detail', params: { slug: 'es-kopi-susu' } },
    cta: 'Lihat Minuman',
  },
]

const activeIndex = ref(0)
const userPaused = ref(false)
const interactionPaused = ref(false)
const reduceMotion = ref(false)

let autoplayTimer = null

const activeSlide = computed(() => slides[activeIndex.value])
const isPaused = computed(() => userPaused.value)

const activeSrcset = computed(
  () =>
    `${activeSlide.value.image.replace('.webp', '-sm.webp')} 420w, ${activeSlide.value.image} 900w`,
)

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
    activeIndex.value = (activeIndex.value + 1) % slides.length
  }, AUTOPLAY_DELAY)
}

function showSlide(index) {
  activeIndex.value = (index + slides.length) % slides.length
  startAutoplay()
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

onMounted(() => {
  reduceMotion.value = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  startAutoplay()
  document.addEventListener('visibilitychange', startAutoplay)
})

onBeforeUnmount(() => {
  stopAutoplay()
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
  >
    <div class="overflow-hidden rounded-3xl bg-primary text-white">
      <div class="grid">
        <Transition name="banner-slide">
          <article
            :key="activeSlide.id"
            class="col-start-1 row-start-1 flex min-h-[140px] items-center gap-3 p-4 sm:min-h-[200px] sm:gap-6 sm:p-6 lg:min-h-[236px] lg:p-8"
            role="group"
            aria-roledescription="slide"
            :aria-label="`${activeIndex + 1} dari ${slides.length}`"
          >
            <div class="min-w-0 flex-1">
              <p
                class="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75"
              >
                {{ activeSlide.eyebrow }}
              </p>
              <h2
                class="mt-1.5 line-clamp-2 text-base font-bold leading-snug text-white sm:text-xl lg:text-2xl"
              >
                {{ activeSlide.title }}
              </h2>
              <p
                class="mt-1 hidden max-w-sm text-sm leading-relaxed text-white/80 sm:block"
              >
                {{ activeSlide.description }}
              </p>
              <RouterLink
                :to="activeSlide.to"
                class="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-4 text-xs font-semibold text-primary transition-colors duration-150 hover:bg-primary-light sm:mt-4 sm:h-10"
              >
                {{ activeSlide.cta }}
                <AppIcon name="arrowRight" :size="16" />
              </RouterLink>
            </div>

            <img
              :src="activeSlide.image"
              :srcset="activeSrcset"
              sizes="(min-width: 1024px) 160px, (min-width: 640px) 128px, 80px"
              width="900"
              height="900"
              :alt="activeSlide.alt"
              loading="eager"
              decoding="async"
              class="h-20 w-20 shrink-0 rounded-2xl object-cover sm:h-32 sm:w-32 lg:h-40 lg:w-40"
            />
          </article>
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
          :aria-label="`Tampilkan banner ${index + 1}: ${slide.title}`"
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
        type="button"
        class="inline-flex h-7 items-center gap-1.5 rounded-full px-2 text-[11px] font-semibold text-text-secondary transition-colors duration-150 hover:text-text-primary"
        :aria-label="
          isPaused ? 'Putar otomatis banner' : 'Jeda otomatis banner'
        "
        @click="toggleAutoplay"
      >
        <AppIcon :name="isPaused ? 'play' : 'pause'" :size="13" />
        {{ isPaused ? 'Putar' : 'Jeda' }}
      </button>
    </div>
  </section>
</template>
