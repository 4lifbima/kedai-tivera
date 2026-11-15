import { useFavoritesStore } from '@/stores/favorites'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'

export function useProductActions() {
  const cart = useCartStore()
  const favorites = useFavoritesStore()
  const ui = useUiStore()

  function addToCart(product, quantity = 1) {
    if (!product) return false

    if (!product.isAvailable) {
      ui.showToast('Menu ini sedang habis. Silakan pilih menu lain.', 'warning')
      return false
    }

    const added = cart.addItem(product.id, quantity)
    if (!added) {
      ui.showToast('Menu ini tidak dapat ditambahkan ke keranjang.', 'warning')
      return false
    }

    const label = quantity > 1 ? `${product.name} (${quantity}x)` : product.name
    ui.showToast(`${label} ditambahkan ke keranjang.`)
    return true
  }

  function toggleFavorite(product) {
    if (!product) return

    const isNowFavorite = favorites.toggleFavorite(product.id)
    ui.showToast(
      isNowFavorite
        ? `${product.name} disimpan ke favorit.`
        : `${product.name} dihapus dari favorit.`,
      isNowFavorite ? 'success' : 'info',
    )
  }

  return { addToCart, toggleFavorite }
}
