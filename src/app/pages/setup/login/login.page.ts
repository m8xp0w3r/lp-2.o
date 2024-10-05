import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonCol,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { AuthService } from "@services";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { environment } from "@environments/environment";
import { SignInData } from "@interfaces";
import { HeaderComponent } from "@components";

@Component({
  selector: 'lp-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonItem, IonInput, IonRow, IonCol, IonButton, HeaderComponent]
})
export class LoginPage implements OnInit, OnDestroy {
  public signingIn = signal(false);
  public wrongLoginData = signal(false);
  public loginFormGroup: FormGroup = new FormGroup({
    email: new FormControl<string>(environment.loginName, [Validators.required, Validators.email]),
    password: new FormControl<string>(environment.loginPassword, [Validators.required])
  });
  private authService: AuthService = inject(AuthService);
  public currentUser$ = this.authService.currentUser$;
  private router = inject(Router);
  private subscriptionSubject: Subject<void> = new Subject<void>();

  constructor() {
  }

  ngOnInit() {
    this.loginFormGroup.valueChanges
      .pipe(takeUntil(this.subscriptionSubject)).subscribe(() => this.wrongLoginData.set(false));
  }

  public async signIn() {
    this.signingIn.set(true);
    const rawFormData = this.loginFormGroup.getRawValue() as SignInData;
    try {
      void this.authService.loginWithEmailAndPassword(rawFormData.email, rawFormData.password);
      void this.router.navigate(["/home"]);
    } catch (e: unknown) {
      console.log(e);
      this.wrongLoginData.set(true);
    } finally {
      this.signingIn.set(false);
    }
  }

  public async logout() {
    void this.authService.signOut();
    void this.router.navigate(["/home"]);
  }

  ngOnDestroy(): void {
    this.subscriptionSubject.next();
    this.subscriptionSubject.complete();
  }

}
