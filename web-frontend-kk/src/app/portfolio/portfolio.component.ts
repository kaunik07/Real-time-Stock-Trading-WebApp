import { inject, Input, OnInit,Component,ChangeDetectorRef, NgZone, input } from '@angular/core';
import { DataCallService } from '../data-call.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {delay, map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import { Router } from '@angular/router';
import { SharedDataService } from '../shared-data.service';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent {

  portfolio_stocks:any=[];
  loading:boolean=false;  
  wallet:any=0;
  isPortfolioEmpty:boolean=false;
  portfolio_loading:boolean=false;
  summaryStored:any
  stock_buy_notify:boolean=false;
  stock_sell_notify:boolean=false;

  @Input() pf_stocks:any;

  constructor(
    private datacall:DataCallService,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private share:SharedDataService,
    private router: Router,
  ) {}

  ngOnInit(){

    // console.log("tesing")
    
    this.summaryStored=this.share.summaryData
    console.log("Stored Data",this.share.summaryData)

    this.portfolio_stocks=[]
    this.buy_quantity=0
    this.buy_total_cost=0
    this.portfolio_loading=true;
    this.fetchWalletAmount()
    

    // this.datacall.port
    this.datacall.portfolioEmpty().subscribe({
      next:(response) => {
        console.log(response)
        if(response==="empty"){
          this.portfolio_loading=false;
          this.isPortfolioEmpty = true;
        }
        else{
          this.isPortfolioEmpty = false;
        }
        // console.log("Beofre if else",this.isPortfolioEmpty)
      },
    })

    if(!this.isPortfolioEmpty){
      // console.log("After",this.isPortfolioEmpty)
      this.fetchPortfolio()
    }

  }
  
  removedPurchaseNotify(){
    this.stock_sell_notify=false;
    this.stock_buy_notify=false;
  }

  fetchWalletAmount(){
    this.datacall.walletamountfetch().subscribe({
      next:(response) => {
        // console.log(response)
        this.wallet = response;
        // this.loading=true
      },
    })
  }

  searchStock(ticker:String){
    this.router.navigate(['/search/',ticker])
  }

  fetchPortfolio(){
    this.datacall.getPortfolio().pipe(
      delay(150)
    ).subscribe({
      next:(response) => {
          this.portfolio_stocks = response
          console.log(response)
          this.portfolio_loading=false;
          this.changeDetectorRef.detectChanges(); 
      },
    })
  }


  // BUY LOGIC
  noBuyPossible:boolean=false
  buyStockM:any=null
  buy_quantity:any=0
  buy_total_cost:any=0
  buy_btt_disable:boolean=true
  buymodal(stock:any,buystock:any){
    this.stock_sell_notify=false;
    this.stock_buy_notify=false;
    this.buyStockM={}
    this.buy_quantity=0
    this.buy_total_cost=0
    this.modalService.open(buystock);
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
    this.stock_buy_notify=true;
    this.stock_sell_notify=false;

    this.share.summaryData.subscribe( data  =>{
      var temp = data[7]
      console.log("Before buy",temp)
      // console.log("Actual Q",this.sellStockM.quantity)
      // console.log("selling",this.sell_quantity)
      data[7]['quantity']=data[7]['quantity']+parseInt(this.buy_quantity,10)
      console.log("After Buying",data[7])
    })
    setTimeout(() => { this.ngOnInit()},1000 )
    setTimeout(() => { 
      this.removedPurchaseNotify()
      console.log("Close notification")
    },3000 )
  }

  costcaluationBuy(event: any){
    this.noBuyPossible=false
    this.buy_quantity=event.target.value
    console.log("Quantity",this.buy_quantity)
    this.buy_total_cost=this.buyStockM.current*this.buy_quantity;
    console.log("Money Cost",this.sell_total_cost)
    this.buy_btt_disable=true
    if(this.buy_total_cost>this.wallet){
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
  sell_btt_disable:boolean=true
  
  sellmodal(stock:any,sellstock:any){
    this.stock_sell_notify=false;
    this.stock_buy_notify=false;
    this.sellStockM={}
    this.sell_quantity=0
    this.sell_total_cost=0
    this.sellStockM=stock
    this.modalService.open(sellstock);
  }


  sellStock(stock:any,){
    this.datacall.delPortfolio({
      'company':stock.ticker,
      'quantity':this.sell_quantity,
      'price':this.sell_total_cost,
      'name':stock.name
    })
    this.stock_buy_notify=false;
    this.stock_sell_notify=true;

    this.share.summaryData.subscribe( data  =>{
      var temp = data[7]
      console.log("Before Selling",temp)
      // console.log("Actual Q",this.sellStockM.quantity)
      // console.log("selling",this.sell_quantity)
      if(this.sell_quantity==this.sellStockM.quantity){
        data[7]['stock']=''
        console.log("Sell",data[7])
      }
      else{
        data[7]['quantity']=data[7]['quantity']-this.sell_quantity
        console.log("Sell",data[7])
      }
    })

    setTimeout(() => { this.ngOnInit()},1000 )
    setTimeout(() => { 
      this.removedPurchaseNotify()
      console.log("Close notification")
    },3000 )
  }

  noSellPossible:boolean=false
  costcaluationSell(event: any,actualQ:any){
    this.noSellPossible=false;
    this.sell_quantity=event.target.value
    console.log("Qunatity",this.sell_quantity)
    this.sell_total_cost=this.sellStockM.current*this.sell_quantity;
    console.log(actualQ)
    this.sell_btt_disable=true
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
}
