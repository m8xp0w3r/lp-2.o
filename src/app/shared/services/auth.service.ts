import { inject, Injectable, isDevMode } from "@angular/core";
import { Auth, connectAuthEmulator, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "@angular/fire/auth";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private firebaseAuth = inject(Auth);
  private currentUserSubject$ = new BehaviorSubject<User | null>(this.firebaseAuth.currentUser);
  public currentUser$: Observable<User | null> = this.currentUserSubject$.asObservable();

  constructor() {
    if (isDevMode()) {
      connectAuthEmulator(this.firebaseAuth, "http://127.0.0.1:9099", { disableWarnings: true });
    }
    onAuthStateChanged(this.firebaseAuth, user => {
      this.currentUserSubject$.next(user);
    });
  }

  public async loginWithEmailAndPassword(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.firebaseAuth, email, password);
  }

  public async signOut(): Promise<void> {
    await signOut(this.firebaseAuth);
  }
}
