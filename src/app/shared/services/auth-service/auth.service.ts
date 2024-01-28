import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private fireAuth: AngularFireAuth, private router: Router) {}

  // Login Method
  async logIn(email: string, password: string) {
    return this.fireAuth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        localStorage.setItem('jwt', 'true');
        if (userCredential.user?.emailVerified == true) {
          this.router.navigate(['']);
        } else {
          this.sendEmailForVarification(userCredential.user);
          this.router.navigate(['/verify-email']);
        }
      });
  }

  // SignUp Method
  async signUp(email: string, password: string) {
    return this.fireAuth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        this.router.navigate(['/login']);
      });
  }

  // Sign Out Method
  signOut() {
    this.fireAuth.signOut().then(
      () => {
        localStorage.removeItem('jwt');
        this.router.navigate(['/login']);
      },
      (err) => {
        console.log(err.message);
      }
    );
  }

  // Forgot Password
  async forgotPassword(email: string) {
    return this.fireAuth.sendPasswordResetEmail(email).then(() => {
      this.router.navigate(['/verify-email']);
    });
  }
  // send Email For Varification
  async sendEmailForVarification(user: any) {
    user.sendEmailVerification().then(
      (res: any) => {
        this.router.navigate(['/verify-email']);
      },
      (err: any) => {
        console.log(err);
        throw Error("Can't send email right now, please try again later.");
      }
    );
  }

  // Get Current User
  getCurrentUser() {
    return this.fireAuth.authState;
  }

  // Sign In With Google
  async googleSignIn() {
    return this.fireAuth
      .signInWithPopup(new GoogleAuthProvider())
      .then((res) => {
        localStorage.setItem('jwt', JSON.stringify(res.user?.uid));
        this.router.navigate(['/']);
      });
  }
}
