import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, forkJoin, Observable } from 'rxjs';

export interface Stocks {
  ticker: string;
  company_name: string,
}


@Injectable({
  providedIn: 'root'
})

export class DataCallService {


  constructor(private http: HttpClient) { }

  stockDataFetch(backend_urls:string[],company:any):Observable<any[]> {
     // Your Node.js server URL
    console.log('URLS',backend_urls);
    const resp = backend_urls.map((api) => this.http.get(`${api}${company['company']}`))
    // let params = new HttpParams().set(company,company['company'])
    // console.log(resp)
    return forkJoin(resp)
  }

  stockPriceGet(company:any):Observable<any>{
  //  return this.http.get('http://localhost:3000/stockPrice?stock='+company)
   return this.http.get('/stockPrice?stock='+company)
  }
  
  watchlistAdd(company:any):void{
    // this.http.get('http://localhost:3000/addWatchlist?stock='+company['company']).subscribe(response => {
    this.http.get('/addWatchlist?stock='+company['company']).subscribe(response => {
      console.log('Response from server:', response);
    });
  }
  
  watchlistDel(company:any):void {
    // this.http.get('http://localhost:3000/delWatchlist?stock='+company['company']).subscribe(response => {
    this.http.get('/delWatchlist?stock='+company['company']).subscribe(response => {
      console.log('Response from server:', response);
    });
  }

  watchlistList():Observable<any>{
   return this.http.get('/getWatchlist')
  //  return this.http.get('http://localhost:3000/getWatchlist')
  }

  watchlistEmpty():Observable<any>{
  //  return this.http.get('http://localhost:3000/emptyWatchlist')
   return this.http.get('/emptyWatchlist')
  }

  watchlistcheck(company:any):Observable<any>{
  //  return this.http.get('http://localhost:3000/checkWatchlist?stock='+company['company'])
   return this.http.get('/checkWatchlist?stock='+company['company']).pipe()
  }

  stockquery(query: string): Observable<any> {
  //  return this.http.get('http://localhost:3000/companyQuery?stock='+query).pipe();
   return this.http.get('/companyQuery?stock='+query).pipe();
  }

  walletamountfetch():Observable<any>{
  //  return this.http.get('http://localhost:3000/getWalletAmount')
   return this.http.get('/getWalletAmount')
  }

  updateWallet(amount:any):void{
    console.log("Total Stock cost: "+amount)
    // this.http.get('http://localhost:3000/updateWalletAmount?amount='+amount).subscribe(response => {
    this.http.get('/updateWalletAmount?amount='+amount).subscribe(response => {
      // console.log('Response from server:', response);
    });
  }

  addPortfolio(company:any):void{
    // console.log(company)
    // this.http.get('http://localhost:3000/addPortfolio?stock='+company['company']+'&quantity='+company['quantity']+'&price='+company['price']+'&name='+company['name']).subscribe(response => {
    this.http.get('/addPortfolio?stock='+company['company']+'&quantity='+company['quantity']+'&price='+company['price']+'&name='+company['name']).subscribe(response => {
      // console.log('Response from server:', response);
    })
  };

  delPortfolio(company:any):void{
    console.log(company)
    // this.http.get('http://localhost:3000/delPortfolio?stock='+company['company']+'&quantity='+company['quantity']+'&price='+company['price']).subscribe(response => {
    this.http.get('/delPortfolio?stock='+company['company']+'&quantity='+company['quantity']+'&price='+company['price']).subscribe(response => {
      // console.log('Response from server:', response);
    })
  };

  getPortfolioStock(company:any):Observable<any>{
    console.log(company)
  //  return this.http.get('http://localhost:3000/getStockPortfolio?stock='+company).pipe()
   return this.http.get('/getStockPortfolio?stock='+company).pipe()
  }

  // getPortfolioStockDetail(company:any):Observable<any>{
  //   console.log(company)
  //   return this.http.get('http://localhost:3000/getStockPortfolio?stock='+company)
  // };

  getPortfolio():Observable<any>{
  //  return this.http.get('http://localhost:3000/getPortfolio').pipe();
   return this.http.get('/getPortfolio').pipe();
  }

  portfolioEmpty():Observable<any>{
  //  return this.http.get('http://localhost:3000/emptyPortfolio')
   return this.http.get('/emptyPortfolio')
  }



}

