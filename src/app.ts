import 'reflect-metadata'
import express from 'express'
import { handleClova } from './clova'
import bodyParser from 'body-parser'
import { ClovaExtension, IntentHandler, IntentListener, ClovaResponse } from './clova'

let app = express()
app.use(bodyParser.json())

class MyIntentListener extends IntentListener {
    @IntentHandler("SampleCustomIntent")
    onSampleCustom(intentName: string, slots: any, response: ClovaResponse) {
        response.addSpeach("안녕하세요")
    }

    @IntentHandler("ThrowDiceIntent")
    onDice(intentName: string, slots: any, response: ClovaResponse) {
        response.addSpeach(JSON.stringify(slots))
    }

    @IntentHandler("Clova.GuideIntent")
    onGuide(intentName: string, slots: any, response: ClovaResponse) {
        response.addSpeach("이렇게 하면 돼요")
    }
}

ClovaExtension.addListener(new MyIntentListener())
ClovaExtension.version = "1.0.0"

app.post("/clova", (req, res) => {
    res.send(handleClova(req.body))
})

app.listen(3000, () => {
    console.log("Server started on port 3000")
})