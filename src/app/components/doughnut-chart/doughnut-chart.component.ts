import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType, ChartOptions, ChartDataSets} from 'chart.js';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ms-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})
export class DoughnutChartComponent implements OnInit {
  @Input() value: any;
  @Input() chartDataSets: any;
  @Input() chartSize = '200px';
  @Input() iconSize: any;
  public doughnutChartLabels: Label[] = [];
  public doughnutChartType: ChartType = 'doughnut';
  public chartOptions: ChartOptions = {
    tooltips: {
      enabled: false
    },
    title: {
      display: false
    },
    legend: {
      display: false
    },
    elements: {
      arc: {
        borderWidth: 0,
      }
    },
    cutoutPercentage: 80,
  };
  color: any;
  // value = 70;
  // chartDataSets = [{
  //   data: [70, 30],
  //   borderWidth: 0,
  //   hoverBorderWidth: 0,
  //   backgroundColor: ['#63CD00', '#E6EDF5'],
  // }];
  constructor() { }

  ngOnInit(): void {
   this.color = this.chartDataSets[0].backgroundColor[0];
  }

}
