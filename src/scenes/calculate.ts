import { Composer } from "telegraf";
import { inlineKeyboard, button } from "telegraf/markup";
import { WizardScene, WizardContext } from "telegraf/scenes";

import { CATEGORIES } from "../constants";
import calculatePrice from "../utils/calculate";

const categoryButtons = new Composer<WizardContext>()

Object.keys(CATEGORIES).forEach((category, index) => {
    categoryButtons.action("cat" + index, async (ctx) => {
        (ctx.scene.state as any).category = category
        const [shipPrice, deliveryPriceEconomy, deliveryPriceExpress] = calculatePrice((ctx.scene.state as any).price, category);
        (ctx.scene.state as any).shipPrice = shipPrice
        const { message_id } = await ctx.reply(
            "<i>Ура! Наконец цена\n\n</i>" + 
            `Товар из категории <b>${category}</b>\n\n` +
            `Цена без доставки: <b>${shipPrice}₽</b>\n\n` +
            `Эконом доставка: <b>${deliveryPriceEconomy}₽</b>\n` + 
            "<i>20-26 дней с момента оплаты доставки</i>\n\n" + 
            `Экспресс доставка: <b>${deliveryPriceExpress}₽</b>\n` + 
            "<i>11-15 дней с момента оплаты доставки</i>\n\n" + 
            "• <i>Доставка</i> оплачивается по прибытию товара на склад, после взвешивания. Цена примерна.",
            {
                parse_mode: "HTML",
                reply_markup: inlineKeyboard([button.callback("Перейти к оформлению заказа", "order")]).reply_markup
            }
        );

        (ctx.session as any).calcMessage = message_id
    })
})

const calculate = new WizardScene("CalculateScene",
    (ctx) => {
        ctx.reply("Для начала нужно <b><i>ввести цену</i> в ¥</b> за твой товар", { parse_mode: "HTML" })
        ctx.wizard.next()
    },
    (ctx) => {
        const price = Number((ctx.message as any).text)
        if (isNaN(price)) {
            return ctx.reply("Цена должна быть числом!")
        }
        
        (ctx.wizard.state as any).price = price
        ctx.reply(
            "Чтож, теперь давай выберем <b><i>категорию</i></b> к которой он относится.\n" +
            "<i>Можешь не переживать, если выберешь не ту категорию, все заявки проверяются менеджером.</i>",
            {
                parse_mode: "HTML",
                reply_markup: inlineKeyboard(Object.keys(CATEGORIES).map((category, index) => [button.callback(category, "cat" + index)])).reply_markup
            }
        )
        ctx.wizard.next()
    },
    categoryButtons
)

calculate.action("order", (ctx) => ctx.scene.enter("OrderScene", ctx.scene.state))

export default calculate;
