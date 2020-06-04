import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'cascade-test-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private auth: AuthService) {}

  userName = 'Not Signed In';
  ngOnInit(): void {
    this.auth.user.subscribe((user) => {
      if (user) {
        this.userName = user.displayName;
      } else {
        this.userName = 'Not Signed In';
      }
    });
  }

  signOut() {
    this.auth.afAuth.signOut();
  }
}
