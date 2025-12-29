import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

 calculateDerived(data: any) {
    const { cellCapacityAh, cellVoltageV, series, parallel } = data;

    return {
      batteryVoltageV: cellVoltageV * series,
      batteryCapacityAh: cellCapacityAh * parallel,
      totalCells: series * parallel,
      energyWhPerCell: cellVoltageV * cellCapacityAh
    };
  }
}
