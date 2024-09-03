import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'Assign-3';

  constructor(private router: Router){
    this.router.navigate(['search/home'])
  //   // this.router.navigate(['test'])
  }
}
