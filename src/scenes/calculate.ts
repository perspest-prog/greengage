import { Composer } from "telegraf";
import { inlineKeyboard, button } from "telegraf/markup";
import { WizardScene, WizardContext } from "telegraf/scenes";
import { fmt, bold, italic } from "telegraf/format";

import { CATEGORIES } from "../constants";
import calculatePrice from "../utils/calculate";

const categoryButtons = new Composer<WizardContext>()

Object.keys(CATEGORIES).forEach((category, index) => {
    categoryButtons.action("cat" + index, (ctx) => {
        (ctx.scene.state as any).category = category
        const [shipPrice, deliveryPriceEconomy, deliveryPriceExpress] = calculatePrice((ctx.scene.state as any).price, category);
        (ctx.scene.state as any).shipPrice = shipPrice
        ctx.reply(
            fmt`Товар из категории ${bold`${category}`}\n\nЦена без доставки: ${bold`${shipPrice}₽`}\n\nЭконом доставка: ${bold`${deliveryPriceEconomy}₽`}\n${italic`20-26 дней с момента оплаты доставки`}\n\nЭкспресс доставка: ${bold`${deliveryPriceExpress}₽`}\n${italic`11-15 дней с момента оплаты доставки`}\n\n${italic`• Доставка`} оплачивается по прибытию товара на склад, после взвешивания. Цена примерна.`,
            inlineKeyboard([button.callback("Перейти к оформлению заказа", "order")])
        )
    })
})

const calculate = new WizardScene("CalculateScene",
    (ctx) => {
        ctx.reply("Введите цену")
        ctx.wizard.next()
    },
    (ctx) => {
        const price = Number((ctx.message as any).text)
        if (isNaN(price)) {
            return ctx.reply("Цена должна быть числом!")
        }

        (ctx.wizard.state as any).price = price
        ctx.reply("Выберите категорию", inlineKeyboard(Object.keys(CATEGORIES).map((category, index) => [button.callback(category, "cat" + index)])))
        ctx.wizard.next()
    },
    categoryButtons
)

calculate.action("order", (ctx) => ctx.scene.enter("OrderScene", ctx.scene.state))

export default calculate;
