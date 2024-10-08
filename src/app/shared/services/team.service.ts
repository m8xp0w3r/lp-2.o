import { inject, Injectable } from '@angular/core';
import { FirestoreService } from "./firestore.service";

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private firestoreService: FirestoreService = inject(FirestoreService);
}
