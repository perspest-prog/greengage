import { WizardScene } from "telegraf/scenes"

const answer = new WizardScene("AnswerScene",
    (ctx) => {
        ctx.reply("Ответьте на это сообщение и напишите свой ответ")
        ctx.wizard.next()
    },
    (ctx) => {
        const text = (ctx.message as any).text

        ctx.telegram.sendMessage(
            (ctx.wizard.state as any).user_id,
            `Вам ответила поддержка!\n\n${text}`)
        ctx.scene.leave()
    },
)

export default answer