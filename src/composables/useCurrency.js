const numberFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 0,
})

export function formatCurrency(value) {
  const amount = Number(value)
  return `Rp${numberFormatter.format(Number.isFinite(amount) ? amount : 0)}`
}

export function useCurrency() {
  return { formatCurrency }
}
