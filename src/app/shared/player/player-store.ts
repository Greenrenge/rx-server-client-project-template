import {Player} from './player.model';
import {Singleton} from 'typescript-ioc';
import {Store} from '../store/store';

@Singleton
export class PlayerStore extends Store<Player> {
   getId(): string {
      return PlayerStore.name;
   }

   getIds(): string[] {
      return Object.keys(this.getAll());
   }
}
