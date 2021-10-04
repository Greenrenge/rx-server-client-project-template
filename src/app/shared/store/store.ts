import {Observable, Subject} from 'rxjs';
import {StoreEntity} from './store.model';
import {MapById} from '../utils/utils.model';
import {filterById} from './store.utils';

export abstract class Store<T> {
   private readonly entities = new Map<string, T>();

   private readonly addedSubject = new Subject<StoreEntity<T>>();
   private readonly removedSubject = new Subject<StoreEntity<T>>();
   private readonly updatedSubject = new Subject<StoreEntity<T>>();
   private readonly committedSubject = new Subject<StoreEntity<T>>();
   private readonly changedSubject = new Subject<StoreEntity<T>>();

   readonly added$ = this.addedSubject.asObservable();
   readonly committed$ = this.committedSubject.asObservable();
   readonly updated$ = this.updatedSubject.asObservable();
   readonly changed$ = this.changedSubject.asObservable();
   readonly removed$ = this.removedSubject.asObservable();

   abstract getId(): string;

   onAdded(id: string): Observable<T> {
      return filterById(this.added$, id);
   }

   onCommitted(id: string): Observable<T> {
      return filterById(this.committed$, id);
   }

   onUpdated(id: string): Observable<T> {
      return filterById(this.updated$, id);
   }

   onChanged(id: string): Observable<T> {
      return filterById(this.changed$, id);
   }

   onRemoved(id: string): Observable<unknown> {
      return filterById(this.removed$, id);
   }

   // TODO: Write description
   // Change from higher-level
   update(id: string, value: T): void {
      const entity: StoreEntity<T> = {id, value};
      this.addOrChangeEntity(id, entity);
      this.updatedSubject.next(entity);
   }

   // TODO: Write description
   // Change from lower-level
   commit(id: string, value: T): void {
      const entity: StoreEntity<T> = {id, value};
      this.addOrChangeEntity(id, entity);
      this.committedSubject.next(entity);
   }

   remove(id: string): void {
      if (this.entities.has(id)) {
         this.entities.delete(id);
         const entity: StoreEntity<T> = {id, value: null};
         this.removedSubject.next(entity);
         this.committedSubject.next(entity);
      }
   }

   get(id: string): T | undefined {
      return this.entities.get(id);
   }

   getAll(): MapById<T> {
      return Object.fromEntries(this.entities.entries());
   }

   clearAll(): void {
      this.entities.clear();
   }

   getSize(): number {
      return this.entities.size;
   }

   private addOrChangeEntity(id: string, entity: StoreEntity<T>): void {
      const hadEntity = this.entities.has(id);
      this.entities.set(id, entity.value as T);
      if (!hadEntity) {
         this.addedSubject.next(entity);
      }
      this.changedSubject.next(entity);
   }
}
