import 'reflect-metadata'
import express from 'express'
import bodyParser from 'body-parser'
import { ClovaExtension, IntentHandler, IntentListener, ClovaResponse, handleClova } from './clova'

let app = express()
app.use(bodyParser.json())

class MyIntentListener extends IntentListener {
    @IntentHandler("MyIntent")
    onMyIntent(_intentName: string, _slots: any, response: ClovaResponse) {
        response.addSpeach("안녕하세요")
    }
}

ClovaExtension.version = "1.0.0"
ClovaExtension.addListener(new MyIntentListener())

ClovaExtension.onExtensionFire(response => {
    response.speak("무엇을 도와드릴까요?")
    response.continueSession({})
})

ClovaExtension.onSessionEnd(response => {
    response.speak('다음에 또 만나요')
    response.endSession()
})

app.post("/clova", (req, res) => {
    res.send(handleClova(req.body))
})

app.listen(3000, () => {
    console.log("Server started on port 3000")
})