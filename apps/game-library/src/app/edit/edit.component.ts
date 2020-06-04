import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
interface Games {
  owner: string;
  description: string;
  title: string;
  id: string;
}
@Component({
  selector: 'cascade-test-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  title: string;
  description: string;

  game: Games;

  gameDoc$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private router: Router
  ) {}

  public id: string;

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.gameDoc$ = this.db
      .collection('games')
      .doc<Games>(this.id)
      .valueChanges()
      .subscribe((game) => {
        this.game = game;
        this.title = game.title;
        this.description = game.description;
      });
  }

  update() {
    this.db
      .collection('games')
      .doc(this.id)
      .set(
        { title: this.title, description: this.description },
        { merge: true }
      )
      .then(() => alert('Game updated!'));
  }

  delete() {
    this.gameDoc$.unsubscribe();
    this.db
      .collection('games')
      .doc(this.id)
      .delete()
      .then(() => {
        this.router.navigate(['/']);
      });
  }
}
