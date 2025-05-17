import { Telegraf, session } from "telegraf"
import { inlineKeyboard, button } from "telegraf/markup"
import { SceneContext, Stage, } from "telegraf/scenes"
import { message } from "telegraf/filters"

import { calculate, order, question, answer, rates, receipt, review } from "./scenes"
import getToken from "./utils/getToken"

const bot = new Telegraf<SceneContext>(getToken())
const scenes = new Stage([calculate, order, question as any, answer, rates, receipt, review])

bot.use(session())
bot.use(scenes.middleware())

bot.action("calc", Stage.enter("CalculateScene") as any)
bot.action("rates", Stage.enter("RatesScene") as any)

bot.action(/deny/, (ctx) => {
    const { id, price } = JSON.parse(ctx.match.input.split(" ").pop())
    
    ctx.scene.enter("ReviewScene", { id })
})
bot.action(/accept/, async (ctx) => {
    const { id, price } = JSON.parse(ctx.match.input.split(" ").pop())
    const { message_id } = await ctx.telegram.sendMessage(
        id,
        "Твоя заявка была <b><i>одобрена</i></b> администратором!\n\n" +
        `Итого к оплате: <b>${price}₽</b>\n\n` + 
        "Оплатите, пожалуйста, по:\n\n" +
        "• номеру карты 2200700829011724\n\n" +
        "• номеру телефона 89261921149\n\n" +
        "📦 <i>Доставка и оплачивается по прибытию товара на склад в Китае. Итоговая стоимость доставки может незначительно отличаться.</i>\n\n" +
        "• Нажмите кнопку <b><i>Заказ оплачен</i></b> после перевода суммы.",
        {
            parse_mode: "HTML",
            reply_markup: inlineKeyboard([button.callback("Заказ оплачен", "order_paid")]).reply_markup
        }
    )
    await ctx.telegram.editMessageReplyMarkup(
        id,
        message_id,
        null,
        inlineKeyboard([button.callback("Заказ оплачен", "order_paid " + message_id)]).reply_markup
    )
})

bot.action(/order_paid/, async (ctx) => {
    const message_id = Number(ctx.match.input.split(" ").pop())
    await ctx.telegram.editMessageReplyMarkup(
        ctx.chat.id,
        message_id,
        null,
        {
            inline_keyboard: []
        }
    )
    await ctx.reply(
        "Супер!\n" +
        "В течении рабочего дня менеджер обработает твой платеж и я скину чек по выкупу товара. Это не заставит тебя долго ждать.\n" + 
        "Спасибо, что выбрал именно нас!  🙏",
        {
            parse_mode: "HTML"
        }
    )
    await ctx.telegram.sendMessage(
        -4650285032,
        `Пользователь @${ctx.from.username} оплатил заказ.`,
        inlineKeyboard([button.callback("Отправить чек", "receipt " + ctx.from.id)])
    )
})

bot.action(/receipt/, (ctx) => {
    const chat_id = Number(ctx.match.input.split(" ").pop())
    ctx.scene.enter("ReceiptScene", { chat_id })
})

bot.action(/answer/, (ctx) => {
    const id = Number(ctx.match.input.split(" ").pop())
    ctx.scene.enter("AnswerScene", {user_id: id})
})

bot.action("lala", (ctx) => {
    ctx.reply(
        "Бежим-бежим!\n" +
        "Твое сообщение по ускорению процесса приема заявки было отправлено.\n" +
        "Если что-то важное, обращайся <b>в поддержку.</b>",
        {
            parse_mode: "HTML"
        }
    )
})

bot.start((ctx) => {
    ctx.replyWithPhoto(
        "AgACAgIAAxkBAAIIPGgjFY6RjdBm7nPNe3wDEsK1bko7AAJK7TEb384ZSTaTGqJlHxYOAQADAgADeQADNgQ",
        {
            caption: "📌 Это основное меню\n\n" + 
                     "Доступны такие услуги как:\n\n" +
                     "Калькулятор\n" +
                     "Связаться с поддержкой\n" + 
                     "Написать отзыв\n" +
                     "Посмотреть отзывы\n\n" +
                     "Также мы будем держать тебя в курсе самых свежих новостей и акций🔥",
            reply_markup: inlineKeyboard([
                [button.callback("Калькулятор", "calc")],
                [button.url("Отзывы", "https://t.me/greenfeedback"), button.url("Связаться с поддержкой", "https://t.me/greenmngr")],
                ["zheksnk", "vanyayep"].includes(ctx.from.username) ? [button.callback("Задать курсы", "rates")] : []
            ]).reply_markup
        }
    )
})

bot.on(message("photo"), (ctx) => {
    console.log(ctx.message.photo)
})

bot.launch()
