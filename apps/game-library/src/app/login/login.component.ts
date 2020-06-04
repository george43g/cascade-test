import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'cascade-test-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  loginWithGoogle(event: any) {
    console.log(event);
    this.auth.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}
