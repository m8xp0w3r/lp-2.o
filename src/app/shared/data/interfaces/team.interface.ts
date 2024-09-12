import { Player } from "./player.model";
import { Storeable } from "./storeable.interface";
import { Scoreable } from "./scorable.interface";

export interface Team extends Storeable, Scoreable {
  player1: Player;
  player2?: Player;
}
