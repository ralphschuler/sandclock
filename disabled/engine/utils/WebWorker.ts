export class WebWorker<T> {

  private method: Function;

  public constructor(method: Function) {
      this.method = method;
  }

  public async exec(...args: any): Promise<T> {
      args = args.map((arg: any) => (typeof arg === "function") ? { type: "function", method: arg.toString() } : arg);
      var workerString = this.workerTemplate.toString();
      workerString = workerString.substring(workerString.indexOf("{") + 1, workerString.lastIndexOf("}"));
      var workerLink = URL.createObjectURL(new Blob([workerString], { type: "text/javascript" }));
      var worker = new Worker(workerLink);

      worker.postMessage({ method: this.method.toString(), args: args });

      var result = await new Promise<T>((resolve, reject) => {
          worker.onmessage = (e) => (e.data && e.data.error) ? reject(e.data.error) : resolve(e.data);
          worker.onerror = (e) => reject(e);
      });

      worker.terminate();
      URL.revokeObjectURL(workerLink);
      return result;
  }

  private workerTemplate(): void {
      onmessage = async (event: MessageEvent) => {
          try {
              var method = new Function(`return ${event.data.method}`)();
              var args = event.data.args.map((arg: any) => (arg.type === "function") ? new Function(`return ${arg.method}`)() : arg);
              try {
                  var result = await method.apply(this, args);
                  return postMessage(result);
              } catch (error: any) {
                  postMessage({ error: error.message });
              }
          } catch (error: any) {
              postMessage({ error: error.message });
          }
      }
  }

}