### Clovex
#### Utility for Naver Clova Extensions

#### 사용방법
나중에 작성할 예정

#### 예제
```typescript
import { ClovaExtension, IntentHandler, IntentListener, ClovaResponse } from './clova'

class MyIntentListener extends IntentListener {
    @IntentHandler("HelloIntent")
    onHelloRequest(intentName: string, slots: any, response: ClovaResponse) {
        response.addSpeach("만나서 반가워요")
    }

    @IntentHandler("Clova.GuideIntent")
    onGuideRequest(intentName: string, slots: any, response: ClovaResponse) {
        response.addSpeach("'안녕하세요' 라고 해보세요")
    }
}

ClovaExtension.addListener(new MyIntentListener())
```