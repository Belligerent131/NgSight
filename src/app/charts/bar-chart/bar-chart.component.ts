import { Component, OnInit } from '@angular/core';
import { SalesDataService } from '../../services/sales-data.service';
import * as moment from 'moment';

//const SAMPLE_BARCHART_DATA: any[] = [
//  { data: [65, 59, 80, 81, 56, 54, 30], label: 'Q3 Sales' },
//  { data: [43, 57, 64, 34, 53, 14, 20], label: 'Q4 Sales' }
//];

//const SAMPLE_BARCHART_LABELS: string[] = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'];

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  constructor(private _salesDataService: SalesDataService) { }

  orders: any;
  orderLabels: string[];
  orderData: number[];

  public barChartData: any[];
  public barChartLabels: String[];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  }

  ngOnInit(): void {
    this._salesDataService.getOrders(1, 100)
    .subscribe((res: any) => {
      const localChartData = this.getChartData(res);
      this.barChartLabels = localChartData.map(x => x[0]).reverse();
      this.barChartData = [{'data': localChartData.map(x => x[1]), 'label': 'Sales'}];
    });
  }

  getChartData(res: Response)
  {
    this.orders = res['page']['data'];
    const data = this.orders.map(o => o.orderTotal);

    const formatedOrders = this.orders.reduce((r, e) => {
      r.push([moment(e.placed).format('YY-MM-DD'), e.orderTotal]);
      return r;
    }, []);

    const p = [];

    const chartData = formatedOrders.reduce((r, e) =>{
      const key = e[0];
      if(!p[key])
      {
        p[key] = e;
        r.push(p[key]);
      } else {
        p[key][1] += e[1];
      }
      return r;
    }, [])

    return chartData;
  }
}
