import 'reflect-metadata'
import express from 'express'
import { handleClova } from './clova'
import bodyParser from 'body-parser'
import { ClovaExtension, IntentHandler, IntentListener, ClovaResponse } from './clova'
import { exec } from 'child_process'

let app = express()
app.use(bodyParser.json())

class MyIntentListener extends IntentListener {
    @IntentHandler("SampleCustomIntent")
    onSampleCustom(_intentName: string, _slots: any, response: ClovaResponse) {
        response.addSpeach("안녕하세요")
        response.continueSession({
            previousIntent: "SampleCustomIntent"
        })
    }

    @IntentHandler("ThrowDiceIntent")
    onDice(_intentName: string, _slots: any, response: ClovaResponse) {
        response.addSpeach("주사위 굴러갑니다!")
    }

    @IntentHandler("Clova.GuideIntent")
    onGuide(intentName: string, slots: any, response: ClovaResponse) {
        response.addSpeach("가이드")
    }

    @IntentHandler("ComputerOff")
    onOff(intentName: string, slots: any, response: ClovaResponse) {
        response.addSpeach("컴퓨터 끄는 중")
        exec("shutdown /s")
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