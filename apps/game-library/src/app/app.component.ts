import { Component } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { environment } from '../environments/environment';

@Component({
  selector: 'cascade-test-root',
  template: `
    <cascade-test-header></cascade-test-header>
    <router-outlet> </router-outlet>
  `,
})
export class AppComponent {
  constructor(private afFunc: AngularFireFunctions) {
    if (environment.local) {
      this.afFunc.useFunctionsEmulator(
        environment.localConfig.functionsEmulatorURL
      );
    }
  }
}
