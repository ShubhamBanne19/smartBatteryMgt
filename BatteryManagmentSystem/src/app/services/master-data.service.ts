import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

    constructor(private http: HttpClient) {}

  getMasterData() {
    return this.http.get<any>('assets/master-data/battery-master.json');
  }
  getValidationRules() {
    return this.http.get<any>('assets/schemas/validation-rules.json');
  }

  getFormulaRegistry() {
    return this.http.get<any>('assets/master-data/formula-registry.json');
  }
}
