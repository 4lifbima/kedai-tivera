<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'
import { useCheckout } from '@/composables/useCheckout'
import { formatCurrency } from '@/composables/useCurrency'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIconButton from '@/components/ui/BaseIconButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['close'])

const cart = useCartStore()
const ui = useUiStore()
const { placeOrder } = useCheckout()

const dialog = ref(null)
const nameInput = ref(null)
const finishButton = ref(null)
const submitted = ref(false)
const order = ref(null)

const form = reactive({
  name: '',
  note: '',
})

const canSubmit = computed(
  () => form.name.trim().length > 0 && props.items.length > 0,
)

onMounted(() => {
  dialog.value?.showModal()
  document.body.classList.add('overflow-hidden')
  nextTick(() => nameInput.value?.focus())
})

onUnmounted(() => {
  document.body.classList.remove('overflow-hidden')
})

function closeDialog() {
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

function submitOrder() {
  if (!canSubmit.value) return

  const placedOrder = placeOrder({
    customerName: form.name,
    note: form.note,
    items: props.items,
    subtotal: props.subtotal,
  })

  if (!placedOrder) {
    ui.showToast('Pesanan belum dapat dibuat. Periksa kembali datamu.', 'danger')
    return
  }

  order.value = placedOrder
  submitted.value = true
  cart.clearCart()
  ui.showToast('Pesanan berhasil dibuat.')
  nextTick(() => finishButton.value?.$el?.focus())
}
</script>

<template>
  <dialog
    ref="dialog"
    class="w-[calc(100%-2rem)] max-w-md rounded-3xl border-0 bg-surface p-0 text-text-primary shadow-sheet"
    aria-labelledby="checkout-title"
    @cancel.prevent="closeDialog"
    @close="handleClosed"
    @click="handleBackdropClick"
  >
    <div class="max-h-[85dvh] overflow-y-auto p-5 sm:p-6">
      <template v-if="!submitted">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 id="checkout-title" class="text-lg font-bold text-text-primary">
              Konfirmasi Pesanan
            </h2>
            <p class="mt-1 text-xs leading-relaxed text-text-secondary">
              Periksa pesananmu sebelum membuat kode pesanan.
            </p>
          </div>
          <BaseIconButton
            name="close"
            label="Tutup dialog"
            variant="ghost"
            size="sm"
            class="-mr-1 -mt-1"
            @click="closeDialog"
          />
        </div>

        <div class="mt-4 rounded-xl bg-surface-secondary p-3">
          <ul class="max-h-40 space-y-2 overflow-y-auto pr-1">
            <li
              v-for="item in items"
              :key="item.id"
              class="flex items-baseline justify-between gap-3 text-sm"
            >
              <span class="min-w-0 text-text-primary">
                {{ item.name }}
                <span class="text-xs text-text-secondary">×{{ item.quantity }}</span>
              </span>
              <span class="shrink-0 font-medium text-text-primary">
                {{ formatCurrency(item.subtotal) }}
              </span>
            </li>
          </ul>
          <div
            class="mt-3 flex items-center justify-between border-t border-border pt-3"
          >
            <span class="text-sm font-semibold text-text-primary">Total</span>
            <span class="text-lg font-bold text-primary">
              {{ formatCurrency(subtotal) }}
            </span>
          </div>
        </div>

        <form class="mt-5 space-y-4" @submit.prevent="submitOrder">
          <div>
            <label
              for="customer-name"
              class="mb-1.5 block text-xs font-semibold text-text-primary"
            >
              Nama pemesan
            </label>
            <input
              id="customer-name"
              ref="nameInput"
              v-model="form.name"
              type="text"
              required
              autocomplete="name"
              placeholder="Nama kamu"
              class="h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div>
            <label
              for="customer-note"
              class="mb-1.5 block text-xs font-semibold text-text-primary"
            >
              Catatan <span class="font-normal text-text-secondary">(opsional)</span>
            </label>
            <textarea
              id="customer-note"
              v-model="form.note"
              rows="2"
              placeholder="Contoh: tanpa sambal"
              class="w-full resize-none rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div class="flex gap-2.5 pt-1">
            <BaseButton
              variant="secondary"
              class="flex-1"
              @click="closeDialog"
            >
              Batal
            </BaseButton>
            <BaseButton
              type="submit"
              class="flex-1"
              :disabled="!canSubmit"
            >
              Buat Pesanan
            </BaseButton>
          </div>
        </form>
      </template>

      <template v-else>
        <div class="flex flex-col items-center py-2 text-center">
          <span
            class="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary"
          >
            <AppIcon name="check" :size="28" />
          </span>
          <h2 id="checkout-title" class="mt-4 text-xl font-bold text-text-primary">
            Pesanan diterima
          </h2>
          <p class="mt-1.5 max-w-xs text-sm leading-relaxed text-text-secondary">
            Tunjukkan kode pesanan ini ke kasir untuk memproses pesananmu.
          </p>

          <div class="mt-5 w-full rounded-xl border border-border bg-surface-secondary px-4 py-3">
            <p class="text-[11px] font-medium uppercase tracking-[0.14em] text-text-secondary">
              Kode pesanan
            </p>
            <p class="mt-1 text-lg font-bold tracking-wide text-primary">
              {{ order?.code }}
            </p>
          </div>

          <div class="mt-3 flex w-full items-center justify-between text-sm">
            <span class="text-text-secondary">Total pesanan</span>
            <span class="font-bold text-text-primary">
              {{ formatCurrency(order?.total ?? subtotal) }}
            </span>
          </div>

          <p v-if="order?.note" class="mt-3 w-full rounded-xl bg-primary-light px-3.5 py-2.5 text-left text-xs leading-relaxed text-primary">
            Catatan: {{ order.note }}
          </p>

          <BaseButton
            ref="finishButton"
            size="lg"
            class="mt-6 w-full"
            @click="closeDialog"
          >
            Selesai
          </BaseButton>
        </div>
      </template>
    </div>
  </dialog>
</template>
