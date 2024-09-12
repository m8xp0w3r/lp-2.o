import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from "rxjs";
import { CollectionService, FirestoreService } from "@services";
import { BasePlayer, PossiblePlayer } from "@interfaces";

@Injectable({
    providedIn: 'root'
})
export class UserSelectionService {
    private firestoreService: FirestoreService = inject(FirestoreService);
    private collectionService: CollectionService = inject(CollectionService);

    public async addPossiblePlayer(name: string): Promise<void> {
        const possiblePlayersCollectionName = await firstValueFrom(this.collectionService.possiblePlayersCollectionName$);
        void this.firestoreService.addItem<BasePlayer>(possiblePlayersCollectionName, {name});
    }

    public async updatePossiblePlayer(player: PossiblePlayer): Promise<void> {
        const possiblePlayersCollectionName = await firstValueFrom(this.collectionService.possiblePlayersCollectionName$);
        void this.firestoreService.updateItem<PossiblePlayer>(possiblePlayersCollectionName, player, player.id);
    }

    public async deletePossiblePlayer(possiblePlayer: PossiblePlayer): Promise<void> {
        const possiblePlayersCollectionName = await firstValueFrom(this.collectionService.possiblePlayersCollectionName$);
        void this.firestoreService.deleteItem(possiblePlayersCollectionName, possiblePlayer.id);
    }
}
