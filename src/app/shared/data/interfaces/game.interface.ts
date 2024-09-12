import { Team } from "./team.interface";
import { Storeable } from "./storeable.interface";

export interface Game extends Storeable {
    team1: Team;
    team2: Team;
    gameNumber: number;
    finished: boolean;
}
