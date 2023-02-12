
export type Action<TArgs, TResult> = (args: TArgs) => Promise<TResult>;

export class Task<TArgs, TResult> {
  private action: Action<TArgs, TResult>;
  private args: TArgs;
  private priority: number;
  private date: Date;
  private resolve: (value: TResult) => void = () => {};
  private reject: (reason: any) => void = () => {};
  private promise: Promise<TResult>;

  public constructor(action: Action<TArgs, TResult>, args: TArgs, priority: number) {
    this.action = action;
    this.args = args;
    this.priority = priority;
    this.date = new Date();
    this.promise = new Promise<TResult>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  public execute(): void {
    this.action(this.args).then((result) => {
      this.resolve(result);
    }).catch((reason) => {
      this.reject(reason);
    })
  }

  public get Priority(): number {
    return this.priority;
  }

  public get Age(): number {
    return new Date().getTime() - this.date.getTime();
  }

  public get Promise(): Promise<TResult> {
    return this.promise;
  }

  public get Action(): Action<TArgs, TResult> {
    return this.action;
  }

  public get Args(): TArgs {
    return this.args;
  }
  
  public get Resolve(): (value: TResult) => void {
    return this.resolve;
  }

  public get Reject(): (reason: any) => void {
    return this.reject;
  }

}