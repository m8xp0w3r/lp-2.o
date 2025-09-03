import { Storeable } from "./storeable.interface";
import { DartPlayer } from "./dart-player.interface";
import { Collectable } from "./collectable.interface";

export interface DartGame extends Storeable, Collectable {
  gameNumber: number;
  calculationFinished?: boolean;
  players: DartPlayer[];
  winner?: DartPlayer;
}
