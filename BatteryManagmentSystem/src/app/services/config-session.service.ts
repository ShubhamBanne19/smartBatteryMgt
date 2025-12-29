import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigSessionService {

  private session$ = new BehaviorSubject<any>({
    selection: {},
    inputs: {},
    derived: {},
    costing: {}
  });

  getSession() {
    return this.session$.asObservable();
  }

  updateSession(partial: any) {
    this.session$.next({
      ...this.session$.value,
      ...partial
    });
  }

}
