import { Player } from "./player.model";
import { Timestamp } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Storeable } from "./storeable.interface";
import { PanschCalculations } from "@models/pansch-calculations.interface";

export interface LatschiPansch extends Storeable, PanschCalculations {
  players?: Observable<Player[]>;
  setupComplete: boolean;
  isReleased: boolean;
  isFinished: boolean;
  edition: number;
  createdAt: Timestamp;
  deletedAt?: Timestamp;
}
