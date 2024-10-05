import { Team } from "./team.interface";
import { Storeable } from "./storeable.interface";
import { Collectable } from "./collectable.interface";

export interface Game extends Storeable, Collectable {
  team1: Team;
  team2: Team;
  gameNumber: number;
  finished: boolean;
}
