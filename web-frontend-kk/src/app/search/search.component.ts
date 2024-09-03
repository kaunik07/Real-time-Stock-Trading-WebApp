import { DataCallService } from '../data-call.service';
import { SharedDataService } from './../shared-data.service';
import { Component,inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {delay, map, startWith} from 'rxjs/operators';
// import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent {
  // @Input() data:any
  public stockSummaryData: any;
  public stockInsightData: any;
  public stockNewsData: any;

  public company_details:any = null;
  public stockprice:any = null;
  public market_status:any = false;
  public sell_button:boolean = false;
  public stock_up:boolean = true;
  public company_name:string = "";
  public walletAmount:any = 0

  
  // FORM 
  // public stock_form:FormGroup;

  private modalService = inject(NgbModal);

  // stock_wishlist:boolean=false;
  public isStockWishlisted = false;
  public stock_wishlist_display = false;
  public company_ticker:string = "";
  stock_wishlist_yes:boolean=false;
  stock_wishlist_no:boolean=false;

  // EARNING
  public company_earning:any = null;
  public eps_actual:any =[]
  public eps_estimate:any =[]
  public eps_surprise:any =[]

  // RECOMMEND
  public company_recommend:any = null;
  public buy:any =[]
  public strong_buy:any = []
  public hold:any = []
  public sell:any = []
  public strong_sell:any = []
  public recommend_period:any = []

  // STOCK PRICE
  public stock_charts:any = null;
  public stock_price:any = []
  public stock_volume:any = []
  public stock_price_time:any = []
  public stock_line_color:string = ""

  // MAIN CHART
  stock_ohlc:any=[]
  stock_vol:any=[]

  //PORTFOLIO
  public stock_portfolio:any=null
  stock_buy_notify:boolean=false
  stock_sell_notify:boolean=false

  // REFRESH TIMER
  private Itid:any
  current_time:any

  constructor(private stockData: SharedDataService,
    private datacall:DataCallService,) {}

  ngOnInit(){

    // this.stockprice=null
    this.stockSummaryData=null

    this.stockData.summaryData.subscribe( data => {
      if(data){
        
        this.stockSummaryData=data
        // console.log(this.stockSummaryData)
        this.company_details=this.stockSummaryData[0]
        this.stockprice=this.stockSummaryData[1]
        this.market_status=this.stockSummaryData[3].isOpen
        this.stock_price_time = this.formatEpochTime(this.stockprice.t)
        this.updateCurrentTime()

        if(this.stockprice.d < 0){
          this.stock_up=false
          this.stock_line_color="#e03c4d"
        }
        else if(this.stockprice.d > 0){
          this.stock_up=true
          this.stock_line_color="#339454"
        }
        else{
          this.stock_line_color="black"
        }

        this.company_name=this.company_details.name;
        this.company_ticker=this.company_details.ticker
        this.company_earning=this.stockSummaryData[5];
        this.company_recommend=this.stockSummaryData[4];
        
        this.stock_charts=this.stockSummaryData[6].results;
        
        // console.log(this.stockSummaryData[7])
        if(this.stockSummaryData[7]['stock'].length==0){
          this.sell_button=false
          this.stock_portfolio=this.stockSummaryData[7]
          console.log("Stock not found in PortFolio")
        }
        else{
          this.sell_button=true
          console.log("Stock found in PortFolio")
          this.stock_portfolio=this.stockSummaryData[7]
        }

        // Buy Sell Logic
        this.walletAmount=0
        this.fetchWalletAmount()

        // console.log("Time",this.stockprice.t)
        console.log(this.company_recommend)
        this.calculate_eps()
        this.calculate_recommend()

        // Main Chart
        this.main_chart_data()

        this.checkWatchlist()

        //Summary Chart
        this.calculate_charts()
        // this.fetchPfDetails()

        

        

        
        
        
        
        // console.log(this.company_earning[0])
        

        
        // console.log("Chart",this.stockSummaryData)

        
        
        // console.log()
      }
    })

    this.Itid = setInterval(() => {
      this.updateStockPrice(this.company_details.ticker)
      this.updateCurrentTime()
    }, 15000);
  }

  ngOnDestroy(): void {
    if (this.Itid) {
      clearInterval(this.Itid); 
    }
  }

  updateCurrentTime():void{

    const current = new Date();
    // this.current_time=current.toLocaleTimeString();
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    const hours = String(current.getHours()).padStart(2, '0');
    const minutes = String(current.getMinutes()).padStart(2, '0');
    const seconds = String(current.getSeconds()).padStart(2, '0');
    this.current_time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  updateStockPrice(stock:string){
    this.datacall.stockPriceGet(stock).subscribe(value =>{
      // console.log("New-Data",value)
      this.stockprice=value
    })
  }

  // convertEpochToFormattedDate(epoch:any):String {
  //   console.log("BEFORE TIME ", epoch)
  //   const date = new Date(epoch * 1000); // Convert epoch time to milliseconds
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const hours = String(date.getHours()).padStart(2, '0');
  //   const minutes = String(date.getMinutes()).padStart(2, '0');
  //   const seconds = String(date.getSeconds()).padStart(2, '0');
  //   console.log("AFTER ", epoch)
  //   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  // }

  fetchPfDetails(){
    if(this.stockSummaryData[7]['ticker'].length==0){
      // console.log("SELLL BUTOON NOOO")
      this.sell_button=false
      this.stock_portfolio=this.stockSummaryData[7]
      console.log("Stock not found in PortFolio")
    }
    else{
      this.sell_button=true
      console.log("Stock found in PortFolio")
      this.stock_portfolio=this.stockSummaryData[7]
    }
    // console.log("Portfolio",this.stock_portfolio)
  }

  main_chart_data(){
    this.stock_ohlc=[]
    this.stock_vol=[]
    // console.log("CHHHARTTT",this.stockSummaryData[8])
    for(let i=0;i<this.stockSummaryData[8].results.length;i++){
      this.stock_ohlc.push([
        this.stockSummaryData[8].results[i].t,
        this.stockSummaryData[8].results[i].o,
        this.stockSummaryData[8].results[i].h,
        this.stockSummaryData[8].results[i].l,
        this.stockSummaryData[8].results[i].c,
      ])

      this.stock_vol.push([
        this.stockSummaryData[8].results[i].t,
        this.stockSummaryData[8].results[i].v,
      ])
    }

    // console.log("OLHC",this.stock_ohlc)
    // console.log("Vol",this.stock_vol)
  }

  calculate_eps(){
    // console.log(this.company_earning)
    // for(let i=this.company_earning.length-1;i>=0;i--){
    for(let i=0;i<this.company_earning.length;i++){
      var s = this.company_earning[i];
      this.eps_actual.push(s.actual)
      this.eps_estimate.push(s.estimate)
      this.eps_surprise.push(s.period+"\nSurprise:"+s.surprise)
    }
    // console.log(this.eps_actual)
  }

  calculate_recommend(){
    // console.log(this.company_recommend)
    for(let i=0;i<this.company_recommend.length;i++){
      this.strong_buy.push(this.company_recommend[i].strongBuy)
      this.buy.push(this.company_recommend[i].buy)
      this.hold.push(this.company_recommend[i].hold)
      this.sell.push(this.company_recommend[i].sell)
      this.strong_sell.push(this.company_recommend[i].strongSell)
      this.recommend_period.push(this.company_recommend[i].period)
      // console.log("recommd-cal",this.buy)
    }
  }

  calculate_charts(){
    // console.log(this.stock_charts)
    for(let i=0;i<this.stock_charts.length;i++){
      this.stock_price.push([this.stock_charts[i].t,this.stock_charts[i].c])
      this.stock_volume.push(this.stock_charts[i].v)
      // this.stock_price_time.push(this.stock_charts[i].t)
    }
  }

  checkWatchlist(){
    this.datacall.watchlistcheck({'company':this.company_ticker}).subscribe({
      next:(response) => {
        this.isStockWishlisted = response;
        console.log("Check Wactchlist",this.isStockWishlisted)
      },
    })
  }

  onWishlist(){
    this.stock_buy_notify=false;
    this.stock_sell_notify=false;
    this.stock_wishlist_display=true;
    if(this.isStockWishlisted){
      this.stock_wishlist_yes=false;
      this.stock_wishlist_no=true;
      this.isStockWishlisted = false;
      console.log("Stock REmoved")
      this.datacall.watchlistDel({'company':this.company_ticker})
    }
    else{
      this.stock_wishlist_no=false;
      this.isStockWishlisted = true;
      this.stock_wishlist_yes=true;
      console.log("Stock Added")
      this.datacall.watchlistAdd({'company':this.company_ticker})
    }
    setTimeout(() => { 
      this.removedWishlistNotify()
      console.log("Close notification")
    },2500 )
  }

  removedWishlistNotify(){
    this.stock_wishlist_no=false;
    this.stock_wishlist_yes=false;
  }

  fetchWalletAmount(){
    this.datacall.walletamountfetch().subscribe({
      next:(response) => {
        console.log(response)
        this.walletAmount = response;
      },
    })
  }

  formatEpochTime(epochTime: number): string {
    console.log("Before epoch_time",epochTime)
    const date = new Date(epochTime * 1000); 
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    // console.log("Before epoch_time",epochTime)
    console.log("After epoch_time",`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  formatEpochTimeCharts(epochTime: number): string {
    const date = new Date(epochTime * 1000); 
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${hours}:${minutes}`;
  }

  // BUY LOGIC
  noBuyPossible:boolean=false
  buyStockM:any=null
  buy_quantity:any=0
  buy_total_cost:any=0
  buy_modal:any=null
  buy_btt_disable:boolean=true

  buymodal(stock:any,buystock:any){
    this.stock_buy_notify=false;
    this.stock_sell_notify=false;
    this.stock_wishlist_yes=false;
    this.stock_wishlist_no=false;
    this.buyStockM={}
    this.buy_quantity=0
    this.buy_total_cost=0
    this.fetchWalletAmount()
    this.buy_modal=null
    this.buy_modal=this.modalService.open(buystock);
    this.buyStockM=stock
  }

  buyStock(stock:any){
    // console.log(stock)
    this.datacall.addPortfolio(
      {'company':stock.ticker,
        'quantity':this.buy_quantity,
        'price':this.buy_total_cost,
        'name':stock.name
    })
    
    setTimeout(() => { 
      this.datacall.getPortfolioStock(stock.ticker).subscribe( {
        next:(data) => {
          this.stock_portfolio=data
          console.log(data)
          this.stockSummaryData[7]=this.stock_portfolio
        }
      });
      this.buy_modal.close()
      this.stock_buy_notify=true;
      this.stock_sell_notify=false;
      this.sell_button=true
    },500 )

    setTimeout(() => { 
      this.removedPurchaseNotify()
      console.log("Close notification")
    },2800 )
    // this.modalService.close()
    
    // console.log(this.stock_portfolio)
  }

  costcaluationBuy(event: any){
    this.noBuyPossible=false
    this.buy_quantity=event.target.value
    if (event.key !== 'Enter') {
      // Update your model or form control if needed
      // console.log(this.myNumber);
      console.log("Quantity",this.buy_quantity)
    }
    // console.log("Quantity",this.buy_quantity)
    this.buy_total_cost=this.buyStockM.current*this.buy_quantity;
    // console.log("Money Cost",this.sell_total_cost)
    this.buy_btt_disable=true
    if(this.buy_total_cost>this.walletAmount){
      this.noBuyPossible=true
      this.buy_btt_disable=true
    }
    else if(this.buy_quantity==0){
      this.buy_btt_disable=true
    }
    else{
      this.buy_btt_disable=false
    }
  }


  // SELL LOGIC
  sellStockM:any=null
  sell_quantity:any=0
  sell_total_cost:any=0
  sell_modal:any=null
  sell_btt_disable:boolean=true
  noSellPossible:boolean=false

  sellmodal(stock:any,sellstock:any){
    this.stock_buy_notify=false;
    this.stock_sell_notify=false;
    this.stock_wishlist_yes=false;
    this.stock_wishlist_no=false;
    this.sellStockM={}
    this.sell_quantity=0
    this.sell_total_cost=0
    this.fetchWalletAmount()
    this.sellStockM=stock
    this.sell_modal=null
    this.sell_modal=this.modalService.open(sellstock);
  }


  sellStock(stock:any){
    this.datacall.delPortfolio({
      'company':stock.ticker,
      'quantity':this.sell_quantity,
      'price':this.sell_total_cost,
      'name':stock.name
    })
    if(this.sell_quantity==this.sellStockM.quantity){
      this.sell_button=false
    }
    setTimeout(() => { 
      this.datacall.getPortfolioStock(stock.ticker).subscribe( {
        next:(data) => {
          this.stock_portfolio=data
          if(data.stock.length==0){
            this.sell_button=false
            this.stock_buy_notify=false;
            this.stock_sell_notify=true;
          }
          this.stock_buy_notify=false;
            this.stock_sell_notify=true;
          this.stockSummaryData[7]=this.stock_portfolio
          console.log(data)
        }
      });
      this.buy_modal.close()
    },800 )
    setTimeout(() => { 
      this.removedPurchaseNotify()
      console.log("Close notification")
    },2600 )
  }

  
  costcaluationSell(event: any,actualQ:any){
    
    this.noSellPossible=false;
    this.sell_quantity=event.target.value
    // console.log("Qunatity",this.sell_quantity)
    this.sell_btt_disable=true
    this.sell_total_cost=this.sellStockM.current*this.sell_quantity;
    // console.log(actualQ)
    if(actualQ<this.sell_quantity){
      this.noSellPossible=true
      this.sell_btt_disable=true
    }
    else if(this.sell_quantity==0){
      this.sell_btt_disable=true
    }
    else{
      this.sell_btt_disable=false
    }
  }

  removedPurchaseNotify(){
    this.stock_sell_notify=false;
    this.stock_buy_notify=false;
  }

}
