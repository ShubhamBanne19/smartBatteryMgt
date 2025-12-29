import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatteryConfiguratorComponent } from './battery-configurator/battery-configurator.component';

const routes: Routes = [
  { path: '', component: BatteryConfiguratorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 


}
