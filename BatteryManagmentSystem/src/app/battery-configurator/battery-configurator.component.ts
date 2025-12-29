// ...existing code...
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MasterDataService } from '../services/master-data.service';
import { CalculationService } from '../services/calculation.service';
import { PricingService } from '../services/pricing.service';
import { ConfigSessionService } from '../services/config-session.service';

@Component({
  selector: 'app-battery-configurator',
  templateUrl: './battery-configurator.component.html',
  styleUrls: ['./battery-configurator.component.css']
})
export class BatteryConfiguratorComponent implements OnInit {
  masterData: any;

  chemistries: any[] = [];
  manufacturers: any[] = [];
  formFactors: any[] = [];
  cellModels: any[] = [];

  validationRules: any;

  // expose results & errors for template
  derivedResult: any = null;
  pricingDecision: any = null;
  errors: string[] = [];

  form = this.fb.group({
    chemistry: [''],
    manufacturer: [''],
    formFactor: [''],
    cellModel: [''],
    // start empty so user must enter values
    series: [null],
    parallel: [null]
  });

  constructor(
    private fb: FormBuilder,
    private masterDataService: MasterDataService,
    private calcService: CalculationService,
    private pricingService: PricingService,
    private configSession: ConfigSessionService
  ) {}

  ngOnInit() {
    this.masterDataService.getMasterData().subscribe(data => {
      this.masterData = data;
      this.chemistries = data.batteryChemistries || [];
      console.log('masterData loaded', this.chemistries);
    }, err => console.error('Failed loading masterData', err));

    // load validation rules (JSON-driven)
    this.masterDataService.getValidationRules().subscribe(r => (this.validationRules = r), err => console.error('validation rules load failed', err));

    // Cascading subscriptions with resets of dependent fields
    this.form.get('chemistry')!.valueChanges.subscribe(id => {
      console.log('chemistry changed ->', id);
      this.manufacturers = this.chemistries.find(c => c.id === id)?.cellManufacturers || [];

      // reset dependent selections
      this.form.patchValue({ manufacturer: '', formFactor: '', cellModel: '' });
      this.formFactors = [];
      this.cellModels = [];
      this.clearResults();
    });

    this.form.get('manufacturer')!.valueChanges.subscribe(id => {
      console.log('manufacturer changed ->', id);
      this.formFactors = this.manufacturers.find(m => m.id === id)?.formFactors || [];

      // reset dependents
      this.form.patchValue({ formFactor: '', cellModel: '' });
      this.cellModels = [];
      this.clearResults();
    });

    this.form.get('formFactor')!.valueChanges.subscribe(id => {
      console.log('formFactor changed ->', id);
      this.cellModels = this.formFactors.find(f => f.id === id)?.cellModels || [];

      // reset cell model
      this.form.patchValue({ cellModel: '' });
      this.clearResults();
    });
  }

  private clearResults() {
    this.derivedResult = null;
    this.pricingDecision = null;
    this.errors = [];
  }

  private validateInputs(): string[] {
    const errors: string[] = [];
    const seriesRaw = this.form.value.series;
    const parallelRaw = this.form.value.parallel;

    const series = Number(seriesRaw);
    const parallel = Number(parallelRaw);

    // check for empty/NaN
    if (seriesRaw === null || seriesRaw === '' || isNaN(series)) {
      errors.push('Series is required and must be a number > 0');
    } else if (series <= 0) {
      errors.push('Series must be greater than zero');
    }

    if (parallelRaw === null || parallelRaw === '' || isNaN(parallel)) {
      errors.push('Parallel is required and must be a number > 0');
    } else if (parallel <= 0) {
      errors.push('Parallel must be greater than zero');
    }

    // json-driven additional rules (kept for backward compat)
    if (this.validationRules?.validations) {
      for (const v of this.validationRules.validations) {
        if (v.field === 'series' && series <= 0 && !errors.includes(v.message)) errors.push(v.message);
        if (v.field === 'parallel' && parallel <= 0 && !errors.includes(v.message)) errors.push(v.message);
      }
    }

    return errors;
  }

  calculate() {
    this.errors = this.validateInputs();
    if (this.errors.length) {
      console.error('Validation failed', this.errors);
      return;
    }

    this.clearResults();

    const model = this.cellModels.find(
      m => m.id === this.form.value.cellModel
    );

    if (!model) {
      const msg = 'No cell model selected';
      console.error(msg);
      this.errors.push(msg);
      return;
    }

    const series = Number(this.form.value.series);
    const parallel = Number(this.form.value.parallel);

    this.derivedResult = this.calcService.calculateDerived({
      cellCapacityAh: model.capacityAh,
      cellVoltageV: model.voltageV,
      series,
      parallel
    });

    this.pricingDecision = this.pricingService.computePrice(
      model.pricing.tiers,
      this.derivedResult.totalCells,
      this.derivedResult
    );

    // persist session for UI/resume
    this.configSession.updateSession({
      selection: {
        chemistry: this.form.value.chemistry,
        manufacturer: this.form.value.manufacturer,
        formFactor: this.form.value.formFactor,
        cellModel: this.form.value.cellModel
      },
      inputs: { series, parallel },
      derived: this.derivedResult,
      costing: this.pricingDecision
    });

    console.log({ derived: this.derivedResult, pricingDecision: this.pricingDecision });
  }
}
// ...existing code...