import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth.service';

@Component({
  selector: 'cascade-test-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  constructor(private db: AngularFirestore, private auth: AuthService) {}

  ngOnInit(): void {}

  createGame(title: string, description: string) {
    console.log(title, description);
    if (!this.auth.uid) {
      alert('Please log in first!');
      return;
    }
    if (!title || !description) {
      alert('Please provide both title and description');
      return;
    }
    const id = this.db.createId();
    this.db
      .collection('games')
      .doc(id)
      .set({ title, description, owner: this.auth.uid, id })
      .then(() => alert('Game Added!'));
  }
}
