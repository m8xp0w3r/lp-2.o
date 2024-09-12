import { Timestamp } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Storeable } from "./storeable.interface";
import { PanschCalculations } from "./pansch-calculations.interface";
import { Player } from "./player.interface";
import { Collectable } from "./collectable.interface";

export interface LatschiPansch extends Storeable, PanschCalculations, Collectable {
  players?: Observable<Player[]>;
  setupComplete: boolean;
  isReleased: boolean;
  isFinished: boolean;
  edition: number;
  createdAt: Timestamp;
  deletedAt?: Timestamp;
}
