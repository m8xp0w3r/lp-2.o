import { Storeable } from "./storeable.interface";
import { Scoreable } from "./scorable.interface";
import { Player } from "./player.interface";
import { Collectable } from "./collectable.interface";

export interface Team extends Storeable, Scoreable, Collectable {
  player1: Player;
  player2?: Player;
}
