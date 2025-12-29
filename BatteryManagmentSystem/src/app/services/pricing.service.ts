import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PricingService {

  getPrice(tiers: any[], quantity: number) {
    return tiers.find(t => quantity >= t.min && quantity <= t.max);
  }
  computePrice(tiers: any[], quantity: number, derived: { totalCells: number; energyWhPerCell: number; batteryCapacityAh?: number; batteryVoltageV?: number; }) {
    const matchedTier = this.getPrice(tiers, quantity);
    if (!matchedTier) {
      return { matchedTier: null, pricePerKwh: null, batteryEnergyKwh: 0, finalCostUsd: 0 };
    }

    // support different property names in tier JSON (value, usdPerKwh, price)
    const pricePerKwh = matchedTier.value ?? matchedTier.usdPerKwh ?? matchedTier.price ?? null;

    // battery energy in kWh = energyWhPerCell * totalCells / 1000
    const batteryEnergyKwh = (derived.energyWhPerCell * derived.totalCells) / 1000;

    const finalCostUsd = pricePerKwh != null ? pricePerKwh * batteryEnergyKwh : 0;

    return { matchedTier, pricePerKwh, batteryEnergyKwh, finalCostUsd };
  }
}
