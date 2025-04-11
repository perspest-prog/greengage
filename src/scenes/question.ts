import { WizardScene } from "telegraf/scenes";
import { inlineKeyboard, button } from "telegraf/markup";

const quesion = new WizardScene("QuestionScene",
    (ctx) => {
        ctx.reply("Введите текст запроса")
        ctx.wizard.next()
    },
    (ctx) => {
        const text = (ctx.message as any).text as string
        ctx.telegram.sendMessage(
            -4650285032,
            `Пользователь @${ctx.from.username} задал вопрос\n\n${text}`,
            inlineKeyboard([
                button.callback("Ответить", "answer " + ctx.from.id),
            ])
        )
        ctx.scene.leave()
    }
)

export default quesion;
