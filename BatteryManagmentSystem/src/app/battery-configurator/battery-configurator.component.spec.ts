import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryConfiguratorComponent } from './battery-configurator.component';

describe('BatteryConfiguratorComponent', () => {
  let component: BatteryConfiguratorComponent;
  let fixture: ComponentFixture<BatteryConfiguratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BatteryConfiguratorComponent]
    });
    fixture = TestBed.createComponent(BatteryConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
