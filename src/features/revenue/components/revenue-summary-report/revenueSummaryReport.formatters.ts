const currencyFormatter = new Intl.NumberFormat('vi-VN')

export const toCurrencyLabel = (value: number) => `${currencyFormatter.format(Math.round(value))} ₫`
