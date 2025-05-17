import { Composer } from "telegraf";
import { message } from "telegraf/filters";
import { button, inlineKeyboard } from "telegraf/markup";
import { WizardScene, WizardContext } from "telegraf/scenes";

const photo = new Composer<WizardContext>()

photo.on(message("photo"), (ctx) => {
    const { file_id } = ctx.message.photo.reduce((prev, curr) => prev.file_size > curr.file_size ? prev : curr)
    ctx.telegram.sendPhoto(
        (ctx.wizard.state as any).chat_id,
        file_id,
        {
            caption: "Спасибо!\n" +
                     "Вот твой чек.\n" +
                     "Уведомлять о статусе заказа будет поддержка, но если что можешь обратиться к ней сам.",
            parse_mode: "HTML",
            reply_markup: inlineKeyboard([button.url("Связаться с поддержкой", "https://t.me/greenmngr")]).reply_markup
        }
    )
    ctx.scene.leave()
})

const receipt = new WizardScene("ReceiptScene",
    (ctx) => {
        ctx.reply("Пришли чек сучка")
        ctx.wizard.next()
    },
    photo
)


export default receipt