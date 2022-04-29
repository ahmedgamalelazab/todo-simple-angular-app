/**
 * @description : this will react like native java script pubsub pattern
 * @Roles : {
 *  1 - it should wrap any event that the user will emit
 *  2- have the ability of track down all the events that the user wil emit and call the callbacks
 * }
 */


export class PubSub<T>{

  private events:Map<string,Array<Function>> | undefined; // this will handle the events

  constructor(){
    this.events = new Map<string,Array<Function>>();
  }

  /**
   * @description : this will register the user event by name
   * @functionality : this will start to register all the user event or event callbacks
   */
  on(event:string, handler:Function):void{
    //in case of the events contain that event we will add it to the events list for that event
      if(this.events?.has(event)){
          this.events?.get(event)?.push(handler);
      }else{
        if(this.events){
            //constructor set that already to map
            this.events.set(event,[]);
            this.events.get(event)?.push(handler);
        }
      }
  }

  /**
   * @description : this function will unregister event from the user events
   * @functionality : this will off the subscription [event] registered by the user
   */
  off(event:string,handler:Function):void{
    if(this.events?.has(event)){
        //left the rest of the implementation to later
        let handlerIndex:number = this.events.get(event)?.indexOf(handler)!;
        this.events.get(event)?.splice(handlerIndex,1); // deleting the event from the events list
    }
  }

  /**
   * @description : this will emit all the user registered events
   * @functionality : it will search in events collection for the event name then it will call any event callback connected to it
   */
  emit(event:string,data:T):void{
    if(this.events?.has(event)){
      this.events.get(event)?.forEach((handler)=>{
          console.warn(data); //working perfect
          handler(data);
      })
    }
  }

}
