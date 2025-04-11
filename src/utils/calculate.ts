import { RATES, CATEGORIES } from "../constants"

const calculatePrice = (price: number, category: string): [number, number, number] => {
    const countUSDT = Math.ceil(price / RATES.CNY_TO_USDT)
    const itemPrice = Math.ceil(countUSDT * RATES.USDT_TO_RUB)

    const box = CATEGORIES[category]
    const deliveryPriceEconomy = Math.ceil(619 * box)
    const deliveryPriceExpress = Math.ceil(789 * box)

    let weigth = 0
    switch (box) {
        case 0.6:
            weigth = 58
            break
        case 1.5:
            weigth = 159
            break
        case 2.5:
            weigth = 138
            break
        case 3.5:
            weigth = 348
            break
    }

    let cdek = 0
    switch (box) {
        case 0.6:
                cdek = Math.ceil(21 * (itemPrice - 1000) / 1000) + 212
                break
            case 1.5:
                cdek = Math.ceil(21 * (itemPrice - 1000) / 1000) + 240
                break
            case 2.5:
                cdek = Math.ceil(21 * (itemPrice - 1000) / 1000) + 267
                break
            case 3.5:
                cdek = Math.ceil(21 * (itemPrice - 1000) / 1000) + 349
                break
    }

    const tax = Math.ceil((price / RATES.CNY_TO_EUR > 250 ? Math.ceil(price / RATES.CNY_TO_EUR - 200) * 0.15 * RATES.EUR_TO_RUB + 500 : 0) * 1.05)

    return [itemPrice + 573, deliveryPriceEconomy + cdek + tax, deliveryPriceExpress + weigth + cdek + tax]
}

export default calculatePrice