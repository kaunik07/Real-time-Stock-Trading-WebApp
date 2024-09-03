import { Component ,ViewChild} from '@angular/core';
import { SharedDataService } from './../shared-data.service';
import { HomeComponent } from '../home/home.component';
import { SearchComponent } from '../search/search.component';
import * as Highcharts from 'highcharts';
import { Options, SeriesOptionsType } from 'highcharts';
import HC_stock from 'highcharts/modules/stock';
import { HighchartsChartModule,HighchartsChartComponent } from 'highcharts-angular';

HC_stock(Highcharts);

@Component({
  selector: 'app-summary-tab',
  templateUrl: './summary-tab.component.html',
  styleUrl: './summary-tab.component.css'
})
export class SummaryTabComponent {

  stockSummaryData: any;

  public company_details:any = null;
  public stockprice:any = null;
  public company_peers:any = [];

  

  constructor(private stockData: SharedDataService, private homeData: HomeComponent,private search:SearchComponent) {}

  ngOnInit(){
    this.company_peers=[];
    this.stockData.summaryData.subscribe( data => {
      if(data){
        this.stockSummaryData=null;
        this.stockSummaryData=data
        // console.log(this.stockSummaryData)
        this.company_details=this.stockSummaryData[0]
        this.stockprice=this.stockSummaryData[1]
        // this.company_peers=this.stockSummaryData[2]
        this.company_peers=this.stockSummaryData[2];
        // this.editPeersList(this.stockSummaryData[2])
      }
    })
  }

  @ViewChild(HighchartsChartComponent, { static: true })
  chartComponent!: HighchartsChartComponent 
  updateFlag: boolean = true;
  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;
  
  StockOptions: Highcharts.Options = {
    chart:{
      backgroundColor: '#f8f8f8'
    },
    title:{
      text: this.search.company_details.ticker+" Hourly Price Variation",
      style: {
        fontSize: '15px',
      }
    },
    navigator: {
      enabled: false
    },
    rangeSelector: {
        enabled: false
    },
    plotOptions: {
      series: {
          animation: false
      },
    },
    series: [{
      name: this.search.company_details.ticker,
      data: this.search.stock_price,
      color:this.search.stock_line_color
      
    }] as SeriesOptionsType[]
  };

  onSearch(company:any ){
    console.log(company)
    this.homeData.onSearchSummary({"company":company})
  }

  editPeersList(data:any){
    for(let i=0;i<data.length;i++){
      if(!data[i].includes(".") && data[i]!=this.search.company_details.ticker){
        this.company_peers.push(data[i])
      }
    }
  }

}

