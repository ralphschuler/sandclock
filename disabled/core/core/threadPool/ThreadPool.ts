import { PriorityQueue } from '../utils/PriorityQueue';
import { Action, Task } from './Task';
import { Thread } from './Thread';

export class ThreadPool {
  private threadCount: number;
  private threads: Thread[];
  private tasks: PriorityQueue<Task<any, any>>;
  private isRunning: boolean;

  public constructor(threadCount: number) {
    this.threadCount = threadCount;
    this.threads = new Array<Thread>(threadCount);
    this.tasks = new PriorityQueue<Task<any, any>>({
      comparatorFunction: (taskA: Task<any, any>, taskB: Task<any, any>) => taskA.Priority - taskB.Priority,
    });
    this.isRunning = false;
  }

  public async createTask<TData, TResult>(action: Action<TData, TResult>, args: TData, priority: number): Promise<TResult> {
    const task = new Task<TData, TResult>(action, args, priority);

    this.tasks.enqueue(task);

    if (!this.isRunning) {
      this.runNextTask();
    }

    return task.Promise;
  }

  private getThread(): Thread|undefined {
    const thread = this.threads.find((thread) => thread.Idle);
    if (thread) {
      return thread;
    }

    if (this.threads.length < this.threadCount) {
      const thread = new Thread();
      this.threads.push(thread);
      return thread;
    }

    return undefined;
  }

  private async runNextTask(): Promise<void> {
    this.isRunning = true;

    const task = this.tasks.dequeue();

    if (task) {
      const thread = this.getThread();
      if (thread === undefined) {
        setTimeout(() => {
          this.runNextTask();
        }, 100);
        return;
      }
      thread.onmessage = (event) => {
        task.Resolve(event.data);
        if (this.isRunning) {
          this.runNextTask();
        }
      };
      thread.onerror = (event) => {
        task.Reject(event);
        if (this.isRunning) {
          this.runNextTask();
        }
      };
      thread.postMessage({
        action: task.Action,
        args: task.Args,
      });
    } else {
      this.isRunning = false;
    }
  }
}