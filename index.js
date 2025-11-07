import dotenv from 'dotenv'
import { app } from './app.js'
const PORT = process.env.PORT || 3000
import { connect_DB } from './db/index.js'
dotenv.config({ path: "./.env" })
connect_DB().then(
    app.listen(PORT, () => {
        console.log(`The app is listening on PORT ${PORT}`)
    })
).catch((err) => {
    console.log(`The MongoDB has not been connected successfully`)
    process.exit(1)
})