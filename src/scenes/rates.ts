import { Composer } from "telegraf"
import { WizardScene, WizardContext } from "telegraf/scenes"
import { inlineKeyboard, button } from "telegraf/markup"
import { RATES } from "../constants"

const actions = new Composer<WizardContext>()

actions.action("1", (ctx) => {
    (ctx.scene.state as any).rate = "CNY_TO_USDT"
    ctx.reply("Введите новый курс")
    ctx.wizard.next()
})

actions.action("2", (ctx) => {
    (ctx.scene.state as any).rate = "USDT_TO_RUB"
    ctx.reply("Введите новый курс")
    ctx.wizard.next()
})

actions.action("3", (ctx) => {
    (ctx.scene.state as any).rate = "CNY_TO_EUR"
    ctx.reply("Введите новый курс")
    ctx.wizard.next()
})

actions.action("4", (ctx) => {
    (ctx.scene.state as any).rate = "EUR_TO_RUB"
    ctx.reply("Введите новый курс")
    ctx.wizard.next()
})

actions

const rates = new WizardScene("RatesScene",
    (ctx) => {
        ctx.reply(
            "Какой курс изменить?",
            inlineKeyboard([
                [button.callback("Курс юаня к usdt", "1")],
                [button.callback("Курс usdt к рублю", "2")],
                [button.callback("Курс ЦБ юаня к евро", "3")],
                [button.callback("Курс ЦБ рубля к евро", "4")]
            ])
        )
        ctx.wizard.next()
    },
    actions,
    (ctx) => {
        const value = Number((ctx.message as any).text)

        if (isNaN(value)) {
            return ctx.reply("Курс должен быть числом!")
        }

        RATES[(ctx.scene.state as any).rate] = value

        ctx.reply(
            "Вот новые курсы\n\n" +
            `• Курс юаня к usdt: <b>${RATES.CNY_TO_USDT}</b>\n` +
            `• Курс usdt к рублю: <b>${RATES.USDT_TO_RUB}</b>\n` +
            `• Курс ЦБ юаня к евро: <b>${RATES.CNY_TO_EUR}</b>\n` + 
            `• Курс ЦБ рубля к евро: <b>${RATES.EUR_TO_RUB}</b>\n`,
            {
                parse_mode: "HTML"
            }
        )
        ctx.scene.leave()
    }
)

export default rates