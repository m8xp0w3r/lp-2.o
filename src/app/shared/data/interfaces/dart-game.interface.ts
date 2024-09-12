import { DartPlayer } from "@models/dart-player.interface";
import { Storeable } from "@models/storeable.interface";

export interface DartGame extends Storeable {
  gameNumber: number;
  calculationFinished?: boolean;
  players: DartPlayer[];
  winner?: DartPlayer;
}
