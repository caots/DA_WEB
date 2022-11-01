import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
declare const Highcharts: any;
@Component({
  selector: 'ms-recruitment-funnel',
  templateUrl: './recruitment-funnel.component.html',
  styleUrls: ['./recruitment-funnel.component.scss']
})
export class RecruitmentFunnelComponent implements OnInit, OnChanges {
  @Input() recruitmentFunnel: any;
  @Input() jobId: any;
  public options: any = {
    chart: {
      type: 'pyramid'
    },
    title: {
      text: '',
      x: -50
    },
    // plotOptions: {
    //   series: {
    //     dataLabels: {
    //       enabled: true,
    //       format: '<b>{point.name}</b> ({point.y:,.2f})',
    //       softConnector: true,
    //     },
    //     center: ['40%', '50%'],
    //     width: '60%'
    //   },
    //   pyramid: {
    //     reversed: false,
    //     neckWidth: '10%',
    //     tooltip: {
    //       pointFormat: '<b>Total</b> {point.y:,.2f}'
    //     }
    //           // shared options for all pyramid series
    //   }
    // },
    credits: {
      enabled:false
    },
    legend: {
      enabled: false
    },
    // colors: ['#27BDCC', '#2668a9', '#4fb648', '#FAAA1E', '#F86E02', '#DE404C', '#747474'],
    colors: ['#27BDCC', '#10A0E6', '#41C294', '#FAAA1E', '#F86E02', '#DE404C', '#747474'],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          plotOptions: {
            series: {
              dataLabels: {
                inside: true, 
                format: `<b>{point.name}</b>`,
              },
              center: ['50%', '50%'],
              width: '100%'
            }
          }
        }
      }]
    }
  }
  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.drawChart();
  }
  ngOnChanges() {
    this.drawChart();
  }
  drawChart() {
    if (Highcharts) {
      const isSmallScreen = this.breakpointObserver.isMatched('(max-width: 768px)');
      const decima = this.jobId == -1 ? 2 : 0;
      const plotOptions =  {
        series: {
          dataLabels: {
            enabled: !isSmallScreen,
            format: `<b>{point.name}</b> ({point.y:,.${decima}f})`,
            softConnector: true,
          },
          center: ['40%', '50%'],
          width: '70%'
        },
        pyramid: {
          reversed: false,
          neckWidth: '10%',
          tooltip: {
            pointFormat: `<b>Total</b> ({point.y:,.${decima}f})`
          }
        }
      };
      Object.assign(this.options, {
        series: this.recruitmentFunnel,
        plotOptions
      })
      Highcharts.chart('recruitment-funnel', this.options);
    }
  }

}
