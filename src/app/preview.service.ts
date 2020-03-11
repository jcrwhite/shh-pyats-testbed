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
    console.log(data);
    return yaml.safeDump(data);
  }

  private _sanitize(data: object): object {
    return Object.keys(data).reduce((accu, key) => {
      if (typeof data[key] !== 'object') {
        accu[key] = data[key];
      } else if (data[key] && Object.keys(data[key]).length > 0) {
        accu[key] = this._sanitize(data[key]);
      }
      return accu;
    }, {});
  }

  update(data: object): void {
    if (!data || Object.keys(data).length < 1) {
      this.previewSubject.next('');
      return;
    }
    this.previewSubject.next(this._createYaml(this._sanitize(data)));
  }
}
