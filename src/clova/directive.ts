import { v4 as uuid } from 'uuid'

export class Directive {
    header: any;
    payload: any;

    constructor({namespace, name, payload}: {namespace: string, name: string, payload: any}) {
      this.header = {
        messageId: uuid(),
        namespace: namespace,
        name: name,
      }
      this.payload = payload
    }
}

export function createAudio(url: string, audioName: string = "", audioLogo: string = ""): Directive {
    return new Directive({
      namespace: 'AudioPlayer',
      name: 'Play',
      payload: {
        audioItem: {
          audioItemId: uuid(),
          stream: {
            beginAtInMilliseconds: 0,
            playType: "NONE",
            token: uuid(),
            url,
            urlPlayable: true
          },
          type: "custom",
        },
        playBehavior: "REPLACE_ALL",
        source: {
          logoUrl: audioLogo,
          name: audioName
        }
      }
    })
  }