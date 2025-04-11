import { WizardScene } from "telegraf/scenes";

const review = new WizardScene("ReviewScene",
    async (ctx) => {
        ctx.reply("Просмотр")
    }
)

export default review;
