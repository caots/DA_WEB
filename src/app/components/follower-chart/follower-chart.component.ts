import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
@Component({
  selector: 'ms-follower-chart',
  templateUrl: './follower-chart.component.html',
  styleUrls: ['./follower-chart.component.scss']
})
export class FollowerChartComponent implements OnInit, OnChanges {
  @Input() lineChartLabels: Label[];
  @Input() lineChartData: ChartDataSets[];
  @Input() totalFollower: number;
  @Input() totalEmployerViews: number;
  
  public doughnutChartType: ChartType = 'line';
  public lineChartOptions: ChartOptions;
  public lineChartColors: Color[] = [
    
    {
      borderColor: "#4FB648",
      backgroundColor: "transparent",
      pointBackgroundColor: "#4FB648",
      pointHoverBackgroundColor: "#fff"
    },
    {
      borderColor: "#2668A9",
      backgroundColor: "transparent",
      pointBackgroundColor: "#2668A9",
      pointHoverBackgroundColor: "#fff"
    }
  ];
  public lineChartLegend = true;
  public lineChartType = "line";
  public lineChartPlugins = [];
  constructor() {
   }

  ngOnInit(): void {
  }
  ngOnChanges() {
    this.lineChartOptions = {
      responsive: true,
      tooltips: {
        enabled: true
      },
      title: {
        display: false
      },
      legend: { 
        display: true, 
        onClick: () => {

        },
        labels: { 
          fontColor: '#495057',
          usePointStyle: true,
          fontFamily: "Avenir Regular",
         }
      },
      elements: {
        arc: {
          borderWidth: 0,
        }
      },
      scales: {
        // We use this empty structure as a placeholder for dynamic theming.
        xAxes: [{
            id: 'x-axis-1',
            position: 'left',
            gridLines: {
              color: '#2668A8',
              display: true,
              drawBorder: true,
              drawOnChartArea: false
            },
            scaleLabel: {
              display: true,
              fontColor: '#2668A8',
              fontSize: 14,
              labelString: 'Date'
            },
            ticks: {
              fontColor: '#2668A8',
              maxTicksLimit: 11
            }
          }],
        yAxes: [
          {
            id: 'y-axis-1',
            position: 'left',
            gridLines: {
              color: '#2668A8',
              display: true,
              drawBorder: true,
              drawOnChartArea: true
            },
            scaleLabel: {
              display: true,
              fontColor: '#2668A8',
              fontSize: 14,
              labelString: 'Followers'
            },
            ticks: {
              fontColor: '#2668A8',
              maxTicksLimit: 6,
              min: 0,
              max: (this.totalFollower > this.totalEmployerViews  ? this.totalFollower : this.totalEmployerViews) + 5
            }
          }
        ]
      }
    };
  }
}
