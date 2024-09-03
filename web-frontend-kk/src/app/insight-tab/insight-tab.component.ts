import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SharedDataService } from './../shared-data.service';
import { SearchComponent } from '../search/search.component';
import { Options, SeriesOptionsType } from 'highcharts';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule,HighchartsChartComponent } from 'highcharts-angular';

@Component({
  selector: 'app-insight-tab',
  templateUrl: './insight-tab.component.html',
  styleUrl: './insight-tab.component.css'
})

export class InsightTabComponent implements OnInit {

  

  stockInsightData: any;

  public company_insights:any = null;
  public company_earning:any = null;
  public company_recommnd:any = null;

  public total_mspr:any = 0;
  public positive_mspr:any = 0;
  public negative_mspr:any = 0;
  public total_change:any = 0;
  public positive_change:any = 0;
  public negative_change:any = 0;
  public company_name:string = "";
  // public eps_actual:any = [];
  // public eps_estimate:any = [];
  // public eps_surprise:any = []

  @ViewChild(HighchartsChartComponent, { static: true })
  chartComponent!: HighchartsChartComponent 
  updateFlag: boolean = true;
  // chartCallback: Highcharts.ChartCallbackFunction = this.calculate_eps

  

  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;
  EPSOptions: Highcharts.Options = {
    chart:{
      type: 'spline',
      // backgroundColor: '#f8f9fa'
      backgroundColor: '#f8f8f8'
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    title: {
      text:"Historical EPS Surprses",
      style: {
        fontSize: '15px', 
        // fontFamily: 'Arial, sans-serif', 
        // fontWeight: 'bold' 
      }
    },
    xAxis: {
      categories: this.search.eps_surprise,
      labels: {
        useHTML: true,
        style: {
          textOverflow: 'none',
          textAlign:'center',
          fontSize:'12px',
        },
        // formatter: function () {
        //   const split = this.value.split('\n');
        //   return `<span>${this.value}</span><br/><span style="color: #707070">${split[1]}</span>`;
        // }
      },
      tickWidth: 0
    },
    yAxis:{
      title:{
        text:'Quaterly EPS'
      }
    },
    series: [
      {
        name: 'Actual',
        type: 'spline', 
        data: this.search.eps_actual
      },
      {
        name: 'Estimate',
        type: 'spline',
        data: this.search.eps_estimate
      }
    ] as SeriesOptionsType[]
  };

  RecommendOptions: Highcharts.Options = {
    chart:{
      type: 'column',
      backgroundColor: '#f8f8f8'
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    title: {
      text:"Recommendation Trends",
      style: {
        fontSize: '15px', 
        // fontFamily: 'Arial, sans-serif', 
        // fontWeight: 'bold' 
      }
    },
    xAxis: {
      categories: this.search.recommend_period,
      labels: {
        useHTML: true,
        style: {
          textOverflow: 'none',
          textAlign:'center',
          fontSize:'12px',
        },
      },
      tickWidth: 0
    },
    yAxis:{
      title:{
        text:'#Analysis'
      }
    },
    plotOptions: {
      series: {
        stacking: 'normal'
      },
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,  
          color: 'black',
          style: {
            textOutline: '1px contrast' // Remove outline
          },
          formatter: function () {
            return this.y; 
          }
        }
      }
    },
    series: [{
      name: 'Strong Buy',
      type: 'column',
      data: this.search.strong_buy,
      color:'#197c40',
    }, {
      name: 'Buy',
      type: 'column',
      data: this.search.buy,
      color:'#25c05d',
    }, {
      name: 'Hold',
      type: 'column',
      data: this.search.hold,
      color:'#c2951f',
    }, {
      name: 'Sell',
      type: 'column',
      data: this.search.sell,
      color:'#f7666a',
    },{
      name: 'Strong Sell',
      type: 'column',
      data: this.search.strong_sell,
      color:'#8c3938',
    }] as SeriesOptionsType[]
  };



  constructor(private stockData: SharedDataService,private company: SearchComponent, private search:SearchComponent) {}

  ngOnInit(){
    

    this.stockData.insightData.subscribe( data => {
      if(data){
        this.stockInsightData=null
        this.stockInsightData=data
        this.company_insights=data[0].data
        console.log("Recommend-Insight",this.search.strong_buy)
        // this.company_earning=this.stockInsightData[0].data
        // this.company_recommnd=data[1]
        // console.log(this.stockInsightData)
        // console.log(this.company_earning)
        this.company_name=this.company.company_name
        this.calculate_mspr()
        this.calculate_change()
      }
    })
  }

  calculate_mspr(){
    for(let i=0;i<this.company_insights.length;i++){
      var mspr=this.company_insights[i].mspr
      this.total_mspr=this.total_mspr+mspr;
      if(mspr > 0){
        this.positive_mspr = this.positive_mspr+mspr;
      }
      else{
        this.negative_mspr = this.negative_mspr+mspr;
      }
    }
  }

  calculate_change(){
    for(let i=0;i<this.company_insights.length;i++){
      var change=this.company_insights[i].change
      // console.log(change)
      this.total_change=this.total_change+change;
      if(change > 0){
        this.positive_change = this.positive_change+change;
      }
      else{
        this.negative_change = this.negative_change+change;
      }
    }
  }

  
}
