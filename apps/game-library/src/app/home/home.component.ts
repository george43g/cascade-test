import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

interface Games {
  owner: string;
  description: string;
  title: string;
  id: string;
}
@Component({
  selector: 'cascade-test-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  games: Observable<Games[]>;
  constructor(private db: AngularFirestore, public auth: AuthService) {}

  ngOnInit(): void {
    this.games = this.db.collection<Games>('games').valueChanges();
  }
}
