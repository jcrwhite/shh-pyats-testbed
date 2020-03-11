import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { default as yaml } from 'js-yaml';

@Injectable({
  providedIn: 'root'
})
export class PreviewService {
  private previewSubject: Subject<string> = new Subject();

  get preview(): Observable<string> {
    return this.previewSubject.asObservable();
  }

  constructor() {}

  private _createYaml(data: object): string {
    return yaml.safeDump(data);
  }

  update(data: object): void {
    if (!data || Object.keys(data).length < 1) {
      this.previewSubject.next('');
      return;
    }
    this.previewSubject.next(this._createYaml(data));
  }
}
