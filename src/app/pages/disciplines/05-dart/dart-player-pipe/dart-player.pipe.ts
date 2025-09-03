import { Pipe, PipeTransform } from '@angular/core';
import { DartPlayer } from "@interfaces";

@Pipe({
  name: 'dartPlayer',
  standalone: true,
})
export class DartPlayerPipe implements PipeTransform {

  transform(players: DartPlayer[]): DartPlayer[] {
    const undefinedPlayersCheck = players.filter(player => player.score !== undefined);
    if (undefinedPlayersCheck.length !== 4) return [];
    return undefinedPlayersCheck.filter(player => player.score === 0);
  }

}
