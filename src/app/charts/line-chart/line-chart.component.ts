import { Component, OnInit } from "@angular/core";
import { LINE_CHART_COLORS } from "../../shared/chart.colors";
import { SalesDataService } from "../../services/sales-data.service";
import * as moment from "moment/moment";

@Component({
  selector: "app-line-chart",
  templateUrl: "./line-chart.component.html",
  styleUrls: ["./line-chart.component.css"],
})
export class LineChartComponent implements OnInit {
  constructor(private _salesDataService: SalesDataService) {}

  topCustomers: object[];
  allOrders: any[];

  lineChartData: any;
  lineChartOptions: any = {
    Responsive: true,
  };

  lineChartLabels: string[];
  lineChartLegends = true;
  lineChartType = "line";
  lineChartColors: any[] = LINE_CHART_COLORS;

  ngOnInit(): void {
    this._salesDataService.getOrders(1, 100).subscribe((res: any) => {
      this.allOrders = res["page"]["data"];

      this._salesDataService.getOrdersByCustomer(3).subscribe((cus: any) => {
        this.topCustomers = cus.map((x) => x["name"]);

        const allChartData: any = this.topCustomers.reduce((result: any, i: any) => {
          result.push(this.getChartData(this.allOrders, i));

          return result;
        }, []);

        let dates = allChartData
          .map((x) => x["data"])
          .reduce((a, i) => {
            a.push(i.map((o) => new Date(o[0])));
            return a;
          }, []);

        dates = [].concat.apply([], dates);

        const r = this.getCustomerOrdersByDate(allChartData, dates)["data"];

        this.lineChartLabels = r[0]["orders"].map((o) => o["date"]);
        this.lineChartData = [
          { data: r[1].orders.map((x) => x.total), label: r[1]["customer"] },
          { data: r[0].orders.map((x) => x.total), label: r[0]["customer"] },
          { data: r[2].orders.map((x) => x.total), label: r[2]["customer"] },
        ];
      });
    });
  }

  getChartData(allOrders: any, name: string) {
    const customerOrders = allOrders.filter((o) => o.customer.name === name);

    const formattedOrders = customerOrders.reduce((r, e) => {
      r.push([e.placed, e.orderTotal]);

      return r;
    }, []);

    return { customer: name, data: formattedOrders };
  }

  getCustomerOrdersByDate(orders: any, dates: any) {
    const customers = this.topCustomers;
    const prettyDates = dates.map((x: Date) => this.toFriendlyDate(x));
    const u = Array.from(new Set(prettyDates)).sort();

    const result = {};
    const dataSets = (result["data"] = []);

    customers.reduce((x, y, i) => {
      const customerOrders = [];
      dataSets[i] = {
        customer: y,
        orders: u.reduce((r, e, j) => {
          const obj: object = {};
          obj["date"] = e;
          obj["total"] = this.getCustomerDateTotal(e, y);
          customerOrders.push(obj);
          return customerOrders;
        }),
      };

      return x;
    }, []);

    return result;
  }

  toFriendlyDate(date: Date) {
    return moment(date).endOf("day").format("YY-MM-DD");
  }

  getCustomerDateTotal(date: any, customer: any) {
    const r = this.allOrders.filter(
      (o) =>
        o.customer.name === customer && this.toFriendlyDate(o.placed) === date
    );

    const result = r.reduce((a, b) => {
      return a + b.orderTotal;
    }, 0);

    return result;
  }
}
