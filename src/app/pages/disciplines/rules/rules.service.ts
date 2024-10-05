import { inject, Injectable } from '@angular/core';

import { map, Observable } from "rxjs";
import { FirestoreService } from "@services";
import { PanschRule } from "@interfaces";

@Injectable({
  providedIn: 'root'
})
export class RulesService {
  private rulesCollectionName = "pansch-rules";
  private firestoreService: FirestoreService = inject(FirestoreService);

  public rules$: Observable<PanschRule[]> = this.firestoreService.getCollection<PanschRule>(this.rulesCollectionName)
    .pipe(map(panschRules => panschRules.sort((a, b) => a.order - b.order)));

  constructor() {
  }
}
