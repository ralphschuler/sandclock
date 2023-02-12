import { Task } from "./Task";



export class Thread extends Worker {
  private idle: boolean;
  
  constructor() {
    super("");
    this.idle = true;

    this.onmessage = (event) => {
      this.idle = false;

      const { action, args } = event.data;
      action(args).then((result: any) => {
        this.postMessage({
          data: result,
          success: true,
        });
      }).catch((error: any) => {
        this.postMessage({
          data: error,
          success: false,
        });
      }).finally(() => {
        this.idle = true;
      });

    }
  }

  public get Idle(): boolean {
    return this.idle;
  }
}