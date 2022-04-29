export function IntentHandler(intent: string) {
    return (target: any, key: string, desc: PropertyDescriptor) => {
      if (typeof desc.value == "function") {
        let handlers: any = Reflect.hasMetadata("handlers", target) ? Reflect.getMetadata("handlers", target) : {}
        if (handlers.hasOwnProperty(intent) && Array.isArray(handlers[intent])) {
          handlers[intent].push(desc.value)
        } else {
          handlers[intent] = [desc.value]
        }
        Reflect.defineMetadata("handlers", handlers, target);
      } else {
        throw "IntentHandler can only be decorated on a method"
      }
    }
  }
  
  export class IntentListener {
    private handlers: any = {}
  }
  
  export class ClovaExtension {
    static listeners: IntentListener[] = []
  
    static version = "0.1.0"
    
    static addListener(listener: IntentListener) {
      this.listeners.push(listener)
    }
  }
  