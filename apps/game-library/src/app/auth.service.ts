import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: Observable<firebase.User>;
  uid: string;

  constructor(public afAuth: AngularFireAuth, private db: AngularFirestore) {
    this.user = afAuth.user;
    afAuth.authState.subscribe((user) => {
      if (!user) return;
      const { displayName, email, uid } = user;
      this.uid = uid;
      db.collection('users')
        .doc(uid)
        .set({ uid, email, displayName }, { merge: true });
    });
  }
}
