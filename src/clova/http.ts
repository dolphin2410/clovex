import _ from "lodash";
import { Directive } from './directive'
import { ClovaExtension } from "./extension";

export class ClovaRequest {
    body: any;

    constructor(body: any) {
        this.body = body
    }

    handle(response: ClovaResponse) {
        switch (this.body.request.type) {
          case 'LaunchRequest':
            return this.onExtensionCall(response)
          case 'IntentRequest':
            return this.onIntentRequest(response)
          case 'SessionEndedRequest':
            return this.onSessionEnd(response)
        }
    }

    // 익스텐션 호출 시
    onExtensionCall(response: ClovaResponse) {
        response.speak("무엇을 도와드릴까요?")
    }

    // 익스텐션 내에서 명령어
    onIntentRequest(response: ClovaResponse) {
        const intent = this.body.request.intent.name
        const slots = this.body.request.intent.slots

        ClovaExtension.listeners.forEach(listener => {
          let handlers = Reflect.getMetadata("handlers", listener)
          
          let intent: string;
          for (intent in handlers) {
            let functions: Function[] = handlers[intent]
            functions.forEach(f => f(intent, slots, response))
          }
        })
    }

    // 세션 종료
    onSessionEnd(response: ClovaResponse) {
        response.speak('다음에 또 만나요')
        response.endSession()
    }
}

export class ClovaResponse {
    response: any;
    version: string;
    sessionAttributes: any;

    constructor() {
        this.response = {
            directives: [],
            shouldEndSession: true,
            outputSpeech: {},
            card: {},
        }

        this.version = ClovaExtension.version
        this.sessionAttributes = {}
    }

    continueSession(sessionAttributes: any) {
        this.response.shouldEndSession = false
        this.sessionAttributes = _.assign(this.sessionAttributes, sessionAttributes)
    }
    
    endSession() {
        this.response.shouldEndSession = true
        this.sessionAttributes = {}
    }

    speak(text: string, language: string = "ko", speechType: string = "PlainText") {
        this.response.outputSpeech = {
          type: 'SimpleSpeech',
          values: {
              type: 'PlainText',
              lang: language,
              value: text,
          },
        }
    }

    addSpeach(outputText: any, language: string = "ko", speechType: string = "PlainText") {
        const outputSpeech = this.response.outputSpeech
        if (outputSpeech.type != 'SpeechList') {
          outputSpeech.type = 'SpeechList'
          outputSpeech.values = []
        }
        if (typeof(outputText) == 'string') {
          outputSpeech.values.push({
            type: speechType,
            lang: language,
            value: outputText,
          })
        } else {
          outputSpeech.values.push(outputText)
        }
    }

    addDirective(directive: Directive) {
        this.response.directives.push(directive)
    }
}

export function handleClova(data: any): ClovaResponse {
    let request = new ClovaRequest(data)
    let response = new ClovaResponse()
    request.handle(response)
    return response
}