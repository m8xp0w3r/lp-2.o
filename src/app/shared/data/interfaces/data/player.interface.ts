import { AirHockey } from "./air-hockey.interface";
import { BasePlayer } from "./base-player.interface";
import { Kicker } from "./kicker.interface";
import { Billiard } from "./billiard.interface";
import { Bowling } from "./bowling.interface";
import { Dart } from "./dart.interface";
import { Bonus } from "./bonus.interface";

export interface Player extends BasePlayer, AirHockey, Kicker, Billiard, Bowling, Dart, Bonus {
  wins: string[];
  totalPoints?: number;
  finalRank?: number;
}
