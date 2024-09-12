import { inject, Injectable } from '@angular/core';
import { AuthService } from "./auth.service";
import { map, Observable } from "rxjs";
import { environment } from "@environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CollectionService {
    private authService: AuthService = inject(AuthService);
    public panschCollectionName$: Observable<string> = this.authService.currentUser$
        .pipe(map(user => this.getEnhancedCollectionName(environment.latschiPanschCollectionName, user?.uid)));

    public possiblePlayersCollectionName$: Observable<string> = this.authService.currentUser$
        .pipe(map(user => this.getEnhancedCollectionName("possible-players", user?.uid)));

    private getEnhancedCollectionName(collectionName: string, uid?: string): string {
        if (uid && uid === "T3dUS8TEiva36eobv3DknTqXm6i2") {
            collectionName += "AppTest";
        }
        return collectionName;
    }
}
