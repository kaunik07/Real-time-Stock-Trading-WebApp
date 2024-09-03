import { Options } from 'highcharts';
import { DataCallService } from './../data-call.service';
import { Component,ViewChild, OnInit, OnDestroy,ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormGroup, FormControl } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SharedDataService } from '../shared-data.service';
import { Subscription,of,delay,interval,distinctUntilChanged,Observable,tap, concat} from 'rxjs';
import { map, startWith, switchMap,debounceTime,catchError,filter, finalize, concatMap } from 'rxjs/operators';
import { __values } from 'tslib';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


interface Option {
  ticker: number;
  company_name: string;
}

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css','./test.css'],
})

export class HomeComponent {


  // public company_details:any = null;
  // public company_news:any = null;
  // public company_insights:any = null;
  // public company_earning:any = null;
  // public company_recommnd:any = null;

  @ViewChild(MatAutocompleteTrigger,{ static: false }) stock_auto_trigger!: MatAutocompleteTrigger;

  // private ;
  public stock_ticker:any = null;
  public stockDataDisplay:boolean = false;
  public stock_found:boolean = false;
  public stocktextValue: string = '';
  public stock_loading:boolean = false;
  public stock_not_found:boolean = false;
  public data:any = null;
  public stock_empty:boolean = false;
  // public stockOptions: Observable<any> = of([]);
  public stockOptions: Option[] = [];
  public autocomplete_loading:boolean = false;
  public autocomplete_data_fetch:boolean = false;


  // public summary_tab_urls=[
  //   "http://localhost:3000/company?stock=",
  //   "http://localhost:3000/getStockPortfolio?stock=",
  //   "http://localhost:3000/stockPrice?stock=",
  //   "http://localhost:3000/companyPeers?stock=",
  //   "http://localhost:3000/marketStatus?stock=",
  //   "http://localhost:3000/companyRecommendation?stock=",
  //   // "http://localhost:3000/companySentiment?stock=",
  //   "http://localhost:3000/companyEarnings?stock=",
  //   "http://localhost:3000/stockcharts?stock=",
  //   "http://localhost:3000/stockMainChart?stock=",
  // ];

  // public stock_check_url=[
  //   "http://localhost:3000/company?stock="
  // ]

  // public news_tab_urls=[
  //   "http://localhost:3000/news?stock="
  // ]

  // public insight_tab_urls=[
  //   "http://localhost:3000/companySentiment?stock=",
  //   // "http://localhost:3000/companyRecommendation?stock=",
  //   // "http://localhost:3000/companyEarnings?stock="
  // ]

  // public stock_refresh_url=[
  //   "http://localhost:3000/stockPrice?stock=",
  // ]

  public summary_tab_urls=[
    "/company?stock=",
    "/stockPrice?stock=",
    "/companyPeers?stock=",
    "/marketStatus?stock=",
    "/companyRecommendation?stock=",
    //000/companySentiment?stock=",
    "/companyEarnings?stock=",
    "/stockcharts?stock=",
    "/getStockPortfolio?stock=",
    "/stockMainChart?stock=",
  ];

  public stock_check_url=[
    "/company?stock="
  ]

  public news_tab_urls=[
    "/news?stock="
  ]

  public insight_tab_urls=[
    "/companySentiment?stock=",
  ]

  public stock_refresh_url=[
    "/stockPrice?stock=",
  ]
 
  constructor(
    private datacall: DataCallService,
    private router: Router,
    private location: Location,
    private stock_data: SharedDataService,
    private route:ActivatedRoute ,
    private changeDetectorRef: ChangeDetectorRef) {}
    // private subscription: Subscription) {}


  stockSearchName = new FormGroup({
    company: new FormControl(''),
  });
  stock_cm=new FormControl();


  ngOnInit(){

    console.log("STORAGE",this.stock_data.summaryData)
    this.stock_data.summaryData.subscribe(value =>{
      console.log("Saved Data",value)
      if(value!==null){
        console.log("RESET",value[9]['reset'])
        if(value[9]['reset']=="no"){
          this.stock_found=true;
          this.stocktextValue = value[0].ticker
          this.location.replaceState(`/search/${value[0].ticker}`)
        }
      }
    })


    this.autocomplete_loading=false


    this.stock_cm.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      distinctUntilChanged(),
      tap(()=>{
        this.stockOptions = []; 
        this.autocomplete_loading = true; 
      }),
      switchMap(value => {
        value=value.trim()
        // console.log(value)
        if(value){
          return this.datacall.stockquery(value);
        } 
        else{
          return of([]);
        }
      }),
      // catchError(()=>of([])) 
      )
      .subscribe(data=>{
        console.log(data['result'])
        this.stockOptions = data;
        this.autocomplete_loading = false; 
      });
      console.log(this.stockOptions)
    
    
    const StockName = this.route.snapshot.paramMap.get('stockName');
    console.log("StockName",StockName)
    if(StockName != "home" && StockName!=null){
      this.onSearchSummary({"company":StockName})
    }

  }

  // stockq(value: string):Observable<any>{
  //   if (value) {
  //     // console.log("Query",value)
  //     return this.datacall.stockquery(value).pipe(
  //       tap(data => console.log('Data from backend:', data)),
  //       // map(data => data.results),
  //       catchError(error => {
  //         this.autocomplete_loading = false;
  //         return of([]);
  //       }),
  //       tap(() => this.autocomplete_loading = false)
  //     );
  //   } else {
  //     // this.autocomplete_data_fetch=true;
  //     return of([]);
  //   }
  // }


  onSearchSummary(stock_name:any){
    // if()
    console.log(stock_name)
    if (this.stock_auto_trigger) {
      this.stock_auto_trigger.closePanel();
    }
    // this.stock_auto_trigger.closePanel();
    // this.stockOptions = []; 
    if(stock_name["company"]!==null){
      stock_name["company"]=stock_name["company"].trim()
      var comp_name=stock_name["company"].trim()
      // stock_name["company"]=stock_name["company"].toUpperCase()
      this.stock_loading=true;
      this.stock_found=false;
      this.stock_not_found=false;
      // this.stockDataDisplay=false;

      if(stock_name["company"]==="" || stock_name["company"]===null){
        this.stock_loading=false;
        this.stock_empty=true;
      }
      else{
        this.stock_empty=false;
        // setTimeout(()=>{
          this.datacall.stockDataFetch(this.stock_check_url,stock_name).subscribe(
            response => {
              stock_name["company"]=stock_name["company"].toUpperCase();
              // console.log(stock_name)
              this.stocktextValue = comp_name;
              if( Object.keys(response[0]).length === 0 ){
                this.stock_found=false;
                this.stock_loading=false;
                this.stock_not_found=true
              }
              else{
                this.stock_not_found=false;
                this.datacall.stockDataFetch(this.summary_tab_urls,stock_name).subscribe(
                  response => {
                      // console.log(response);
                      this.location.replaceState(`/search/${response[0].ticker}`)
                      
                      this.stock_loading=true;
                      response.push({'reset':"no"});
                      console.log(response)
                      this.stock_data.storeSummaryData(response)
                      this.stock_data.summaryData.subscribe( data  =>{
                        // console.log("Before Reset",data)
                        data[9]['reset']="no"
                        // console.log("After Reset",data)
                      })
                      // console.log(this.stockDataDisplay)
                      this.onSearchNews(stock_name)
                      this.onSearchInsight(stock_name)
                  }
                );
              }
            }
          );
        }
    }
    else{
      this.stock_loading=false;
      this.stock_empty=true;
    }
    this.changeDetectorRef.detectChanges()
  }

  onSearchNews(stock_name:any){
    // console.log(this.stockSearchName.value)
    // console.log(this.stock_found)
    this.datacall.stockDataFetch(this.news_tab_urls,stock_name).subscribe(
    response => {
      // console.log(response); 
      this.stock_data.storeNewsData(response)
      }
    );
  }

  onSearchInsight(stock_name:any){
    // console.log(this.stockSearchName.value)
      this.datacall.stockDataFetch(this.insight_tab_urls,stock_name).subscribe(
        response => {
            // console.log(response); 
            this.stock_data.storeInsightData(response)
            this.stock_loading=false;
            setTimeout(()=>{
              // this.stock_loading=false;
              this.stock_found=true;
            },200)
        }
      );
      // setTimeout(()=>{
        // this.stock_loading=false;
        // this.stockDataDisplay=true;
      // },1000)
  }

  clearData(){
    this.stock_found = false;
    this.stock_not_found = false;
    this.stock_empty = false;
    this.autocomplete_loading=false;
    this.stock_loading=false;
    // this.location.replaceState(`/search/home`)
    this.router.navigate(['/search/home'])
    this.stock_cm.setValue('')
    // this.stockSearchName.controls['company'].reset();
    // this.stock_data.summaryData=of([])
    this.stock_data.summaryData.subscribe( data  =>{
      console.log("Before Reset",data)
      data[9]['reset']="yes"
      console.log("After Reset",data)
    })

    // this.route
    // this.stockOptions = of([])
    // this.ngOnInit()
  }
  
  StockSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedStock = event.option.value;
    this.stock_found = false;
    this.stock_not_found = false;
    this.stock_empty = false;
    // this.stock_data.stockSummaryData=null
    // this.stockOptions = of([])
    this.autocomplete_loading=false;
    console.log('Selected option:', selectedStock);
    this.onSearchSummary({'company':selectedStock})

  }

}