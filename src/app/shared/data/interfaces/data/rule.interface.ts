import { Storeable } from "./storeable.interface";

export interface PanschRule extends Storeable {
  title: string;
  content: string;
  order: number;
}
