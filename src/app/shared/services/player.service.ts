import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { FirestoreService } from "./firestore.service";
import { map } from "rxjs";
import { CollectionUtil } from "@util/collection.util";
import { CollectionService } from "./collection.service";
import { BasePlayer, LatschiPansch, Player, PossiblePlayer } from "@interfaces";

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  public possiblePlayers$: WritableSignal<PossiblePlayer[]> = signal([]);
  public selectedPlayers$: Signal<PossiblePlayer[]> = computed(() => this.possiblePlayers$().filter(player => player.selected));
  private firestoreService: FirestoreService = inject(FirestoreService);
  private collectionService: CollectionService = inject(CollectionService);

  constructor() {
    this.collectionService.possiblePlayersCollectionName$.subscribe(possiblePlayersCollectionName => {
      this.firestoreService.getCollection<PossiblePlayer>(possiblePlayersCollectionName)
      .pipe(map(possiblePlayers => possiblePlayers.sort((a: PossiblePlayer, b: PossiblePlayer) => {
        if (a.selected && b.selected) return a.name > b.name ? 1 : -1;
        return a.selected ? -1 : 1;
      })))
      .subscribe(possiblePlayers => this.possiblePlayers$.set(possiblePlayers));
    });
  }

  public async getPlayerSnapshot(latschiPansch: LatschiPansch): Promise<Player[]> {
    if (!latschiPansch.id) {
      console.error(`Latschi Pansch Vol. ${latschiPansch.edition} has no Id set.`);
      return [];
    }
    return this.firestoreService.getSnapshot<Player>(CollectionUtil.getSubCollectionName(latschiPansch.collectionName, latschiPansch.id, "players"));
  }

  /*public async getPlayers(latschiPansch: LatschiPansch): Promise<Observable<Player[]>> {
      if (!latschiPansch.id) {
          console.error(`Latschi Pansch Vol. ${ latschiPansch.edition } has no Id set.`);
          return of([]);
      }
      return this.firestoreService.getCollection<Player>(CollectionUtil.getSubCollectionName(latschiPansch.collectionName, latschiPansch.id, "players"));
  }*/

  public async setPlayer(latschiPansch: LatschiPansch, players: BasePlayer[]): Promise<void> {
    if (players.length === 16 && latschiPansch.id) {
      players.forEach(player => this.firestoreService.addItem<BasePlayer>(CollectionUtil.getSubCollectionName(latschiPansch.collectionName, latschiPansch.id!, "players"), player));
    }
  }

  public async updatePlayer(latschiPansch: LatschiPansch, player: Player): Promise<void> {
    if (latschiPansch.id && player.id) {
      void this.firestoreService.updateItem<Player>(CollectionUtil.getSubCollectionName(latschiPansch.collectionName, latschiPansch.id, "players"), player, player.id);
    }
  }
}
