import deepmerge from 'deepmerge';
import {Subject} from 'rxjs';

export class TimeMapBuffer<K, V> {
   private readonly dataSubject = new Subject<[K, V][]>();
   readonly data$ = this.dataSubject.asObservable();

   private readonly loopBind;
   private readonly data = new Map<K, V>();

   private lastSentTime = 0;
   private enabled = false;
   private frameLengthMs = 0;
   private defaultValue: V;

   constructor() {
      this.loopBind = this.loop.bind(this);
      this.start();
   }

   setFrameLengthMs(value: number): void {
      this.frameLengthMs = value;
   }

   setDefaultValue(value: V): void {
      this.defaultValue = value;
   }

   add(key: K, value: V): void {
      this.data.set(key, this.mergeValue(key, value));
      if (this.enabled) {
         this.sendInTimeIfNotEmpty();
      }
   }

   start(): void {
      this.enabled = true;
      this.loop();
   }

   stop(): void {
      this.enabled = false;
   }

   private loop(): void {
      if (this.enabled) {
         this.sendInTimeIfNotEmpty();
         requestAnimationFrame(this.loopBind);
      }
   }

   private sendInTimeIfNotEmpty(): void {
      if (Date.now() > this.lastSentTime + this.frameLengthMs) {
         if (this.data.size > 0) {
            this.send();
         }
      }
   }

   private send(): void {
      this.lastSentTime = Date.now();
      const data = this.getBufferedData();
      this.data.clear();
      this.dataSubject.next(data);
   }

   private getBufferedData(): [K, V][] {
      return Array.from(this.data.entries());
   }

   private mergeValue<V>(event: K, value: V): V {
      return deepmerge.all([this.data.get(event) ?? this.defaultValue, value]);
   }
}
