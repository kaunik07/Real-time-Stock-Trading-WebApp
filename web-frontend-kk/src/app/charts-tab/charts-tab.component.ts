// import HC_stock from 'highcharts/modules/stock';
// import HC_gant from 'highcharts/modules/stock';
import { Component } from '@angular/core';
import { Options } from 'highcharts';
import { SearchComponent } from '../search/search.component';
import * as Highcharts from 'highcharts/highstock';
// import HC_exporting from 'highcharts/modules/exporting';
// import HC_map from 'highcharts/modules/stock';
import IndicatorsCore from 'highcharts/indicators/indicators';
import HighchartsMore from 'highcharts/highcharts-more';
import VBP from 'highcharts/indicators/volume-by-price';
import SMA from 'highcharts/indicators/ema';

// import EMA from 'highcharts/indicators/SMA';

IndicatorsCore(Highcharts);
// HighchartsMore(Highcharts);

// EMA(Highcharts);
// HC_gant(Highcharts)
SMA(Highcharts)
VBP(Highcharts);


@Component({
  selector: 'app-charts-tab',
  templateUrl: './charts-tab.component.html',
  styleUrl: './charts-tab.component.css'
})
export class ChartsTabComponent {

  constructor(private stockS:SearchComponent){}
  
//   groupingUnits:any = [[
// [
//     'month',
//         [1, 2, 3, 4, 6]
//     ]];

  

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    rangeSelector: {
      enabled:true,
      // selected: 3,
      buttons: [
        { 
          type: 'month', 
          count: 1, 
          text: '1m' 
        },
        { type: 'month', 
          count: 3,
          text: '3m' 
        },
        { type: 'month', 
          count: 6, 
          text: '6m' 
        },
        { type: 'ytd',
          // count:4,
          text: 'YTD' 
        },
        { type: 'year', 
          count: 1, 
          text: '1y' 
        },
        { type: 'all', 
          // count:6,
          text: 'ALL' 
        }
      ],
    },
    legend: {
      enabled: false
    },
    navigator: {
      enabled: true
    },
    exporting: {
      enabled: false
    },
    title: {
      text: this.stockS.company_details.ticker+" Historical"
    },
    subtitle: {
      text: 'With SMA and Volume by Price technical indicators'
    },
    yAxis: [{
      startOnTick: false,
      labels: {
        align: 'right',
        x: -3
      },
      endOnTick: false,
      title: {
        text: 'OHLC'
      },
      lineWidth: 2,
      resize: {
        enabled: true
      },
      height: '60%',
      opposite:true,
    }, {
      height: '35%',
      offset: 0,
      lineWidth: 2,
      labels: {
        align: 'right',
        x: -3
      },
      opposite:true,
      title: {
        text: 'Volume'
      },
      top: '65%',
      
    }],
    plotOptions: {
      column: {
          // pointPadding: 0.47,
          pointPlacement: 'on',
      },
      series: {
          animation: true
      },
    },
    
    series: [{
        type: 'candlestick',
        name: this.stockS.company_details.ticker,
        id:'cs',
        data:this.stockS.stock_ohlc,
        tooltip: {
          valueDecimals: 2
        }
      },
      {
        type: 'column',
        name: 'Volume',
        id:'sv',
        data: this.stockS.stock_vol,
        yAxis: 1 ,
        pointPadding: 0,
        groupPadding: 0.1,
      },
      {
        type: 'vbp',
        linkedTo: 'cs',
        params: {
          volumeSeriesID: 'sv'
        },
        zoneLines: {
          enabled: false,
        },
        dataLabels: {
          enabled: false
        },
        
      },
      {
        type: 'sma',
        linkedTo: 'cs',
        zIndex: 1,
        params: {
          period: 14
        },
        marker: {
          enabled: false
        }
      }],
    xAxis: {
      type: 'datetime'
    },
  };

}