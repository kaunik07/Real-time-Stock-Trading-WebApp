import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
// import { AppComponent } from './app.component';
// import { SearchComponent } from './search/search.component';



const routes: Routes = [
  { path:'', redirectTo:'search/home',pathMatch:'full'},
  // { path:'search/', component:HomeComponent},
  { path:'search/home', component:HomeComponent},
  // { path:'search/:functionName/:argument', component: HomeComponent },
  { path:'search/:stockName',component:HomeComponent},
  { path:'watchlist',component:WatchlistComponent},
  { path:'portfolio',component:PortfolioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
