import { WizardScene } from "telegraf/scenes";
import { inlineKeyboard, button } from "telegraf/markup";

const review = new WizardScene("ReviewScene",
    (ctx) => {
        ctx.reply("Укажите причину отказа")
        ctx.wizard.next()
    },
    (ctx) => {
        const reason = (ctx.message as any).text

        ctx.telegram.sendMessage(
            (ctx.wizard.state as any).id,
            "Твой заказ был обработан менеджером, но нужно кое что подправить:\n\n" +
            `${reason}`,
            {
                parse_mode: "HTML",
                reply_markup: inlineKeyboard([button.callback("Заказать снова", "calc")]).reply_markup
            }
        )
        ctx.scene.leave()
    }
)

export default review;
