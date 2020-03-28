import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SalesDataService {
  constructor(private _http: HttpClient) {}

  url: string = "http://localhost:5000/api/order/";

  getOrders(pageIndex: number, pageSize: number) {
    return this._http.get(this.url + pageIndex + "/" + pageSize);
  }

  getOrdersByCustomer(n: number) {
    return this._http.get(this.url + "ByCustomer/" + n);
  }

  getOrdersByState() {
    return this._http.get(this.url + "ByState/");
  }
}
