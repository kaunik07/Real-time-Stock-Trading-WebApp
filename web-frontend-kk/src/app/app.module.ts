import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { SearchComponent } from './search/search.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DataCallService } from './data-call.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SummaryTabComponent } from './summary-tab/summary-tab.component';
import { NewsTabComponent } from './news-tab/news-tab.component';
import { InsightTabComponent } from './insight-tab/insight-tab.component';
import { ChartsTabComponent } from './charts-tab/charts-tab.component';
import { HighchartsChartModule} from 'highcharts-angular';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormControl, FormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatTabsModule } from '@angular/material/tabs';
// import { CustomReuseStrategy } from './k-route';
import { RouteReuseStrategy } from '@angular/router';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    WatchlistComponent,
    PortfolioComponent,
    SearchComponent,
    SummaryTabComponent,
    HomeComponent,
    NewsTabComponent,
    InsightTabComponent,
    ChartsTabComponent,
    FooterComponent
  ],
  imports: [
    HighchartsChartModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    AsyncPipe,
    MatTabsModule
  ],
  providers: [
    provideAnimationsAsync(),
    // { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
