import { Component } from '@angular/core';
import { DataCallService } from '../data-call.service';
import { Router } from '@angular/router';
import { SharedDataService } from '../shared-data.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})


export class WatchlistComponent {

  constructor(private data_call:DataCallService,
              private router: Router,
              private share:SharedDataService){}

  public isWatchlistEmpty:any={};
  public watchlist_stocks:any=[];
  public stock_up:boolean = true;
  public company_name:string = "";
  // public stock_loading:boolean = false;
  public watchlist_loading:boolean=false;
  public WatchlistEmpty:boolean=false;
  public WatchlistFetched:boolean=false;

  state:any;

  ngOnInit(){
    // console.log(this.share.storeSummaryData)
    this.isWatchlistEmpty=false;
    this.watchlist_stocks=[];
    // this.stock_loading=true;
    this.watchlist_loading=true;
    // setTimeout(() =)
    this.data_call.watchlistEmpty().subscribe({
      next:(response) => {
        if(response["status"]=="empty"){
          this.watchlist_loading=false;
          this.WatchlistEmpty=true;
          this.WatchlistFetched=false;
          this.isWatchlistEmpty = response;
          // console.log("YYY RUNNING HERRRREEEE")
        }
        else{
          this.watchlist_loading=true
          // console.log("YYY RUNNING")
          // this.watchlist_stocks=this.getWatchlistData()
          setTimeout(() => {
            this.data_call.watchlistList().subscribe({
              next:(response) => {
                // this.stock_loading=true;
                this.watchlist_stocks = response;
                // this.stock_loading=false;
                // console.log(this.watchlist_stocks)
                this.watchlist_loading=false;
                this.WatchlistEmpty=false;
                this.WatchlistFetched=true;
                console.log("circle",this.watchlist_loading)
                if(this.watchlist_stocks.length===0){
                  this.watchlist_loading=false;
                  this.WatchlistEmpty=true;
                  this.WatchlistFetched=false;
                }
              },
            })
          },400)
          

        }
        // this.stock_loading=true;
        // this.isWatchlistEmpty = response;
      },
    })
  }

  // getWatchlistData(){
  //   this.data_call.watchlistList().subscribe({
  //     next:(response) => {
  //       this.watchlist_stocks = response;
  //       console.log(response)
  //     },
  //   })
  // }

  deleteWatchlist(company:string){
    this.data_call.watchlistDel({"company":company});
    this.watchlist_loading=true;
    // this.ngOnInit()
    // setTimeout(() => {
    this.ngOnInit();
    // }, 400);
    
  }

  cardOnClick(company:string){
    // this.homedata.onSearchSummary({"company":company})
    // var d["comapny"] comapany;
    // this.router.navigate(['/search/','onSearchSummary',company])
    this.router.navigate(['/search/',company])
  }

}
