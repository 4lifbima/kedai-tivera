import { readStorage, writeStorage } from '@/composables/useLocalStorage'

const STORAGE_KEY = 'tivera.orders.v1'
const MAX_STORED_ORDERS = 20

function createOrderCode() {
  const now = new Date()
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('')
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return `TVR-${date}-${suffix}`
}

export function useCheckout() {
  function placeOrder({ customerName, note, items, subtotal }) {
    const name = String(customerName ?? '').trim()
    if (!name || !Array.isArray(items) || items.length === 0) return null

    const order = {
      code: createOrderCode(),
      createdAt: new Date().toISOString(),
      customerName: name,
      note: String(note ?? '').trim(),
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: Number(subtotal) || 0,
    }

    const stored = readStorage(STORAGE_KEY, [])
    const history = Array.isArray(stored) ? stored : []
    writeStorage(STORAGE_KEY, [order, ...history].slice(0, MAX_STORED_ORDERS))

    return order
  }

  return { placeOrder }
}
