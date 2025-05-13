import { env } from "node:process"
import { readFileSync } from "node:fs"

const getToken = () => {
    return env.NODE_ENV === "production" ? readFileSync("/run/secrets/TOKEN", { encoding: "utf-8" }) : env.TOKEN
}

export default getToken