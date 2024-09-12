import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from "rxjs";
import { FirestoreService } from "./firestore.service";
import { LatschiPanschService } from "./latschi-pansch.service";
import { Game, Storeable, Team } from "@interfaces";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private firestoreService: FirestoreService = inject(FirestoreService);
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);

  constructor() {
  }

  public async getGames<T extends Storeable>(gameCollectionName: string): Promise<Observable<T[]>> {
    const currentPansch = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (currentPansch && currentPansch.id) {
      return this.firestoreService.getCollection<T>(gameCollectionName);
    }
    return Promise.reject();
  }

  public async updateGame<T extends Storeable>(game: T): Promise<void> {
    if (game.id) {
      await this.firestoreService.updateItem<T>(game.collectionName, game, game.id);
    }
  }

  public getWinningTeamOf(game: Game): Team {
    return (game.team1.score ?? 0) > (game.team2.score ?? 0) ? game.team1 : game.team2;
  }

  public async calculateFakeResult(games: Game[]): Promise<void> {
    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      const score1 = Math.floor(Math.random() * 100) + 1;
      const score2 = Math.floor(Math.random() * 100) + 1;
      game.team1.score = score1;
      game.team2.score = score1 === score2 ? score2 + 1 : score2;
      void this.updateGame<Game>(game);
    }
  }
}
