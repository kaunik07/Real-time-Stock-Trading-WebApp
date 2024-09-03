import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  public stockSummarySource = new BehaviorSubject<any>(null);
  summaryData = this.stockSummarySource.asObservable();

  public stockNewsSource = new BehaviorSubject<any>(null);
  newsData = this.stockNewsSource.asObservable();

  public stocInsightSource = new BehaviorSubject<any>(null);
  insightData = this.stocInsightSource.asObservable();

  constructor() { }


  storeSummaryData(data: any) {
    this.stockSummarySource.next(data);
  }

  storeNewsData(data: any) {
    this.stockNewsSource.next(data);
  }

  storeInsightData(data: any) {
    this.stocInsightSource.next(data);
  }
  
  private data: any;
  storeData(data: any): void {
    this.data = data;
  }

  getData(): any {
    return this.data;
  }

}
