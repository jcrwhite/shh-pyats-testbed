import { Component, OnInit, OnDestroy } from '@angular/core';
import { PreviewService } from './preview.service';
import { Observable, Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TestbedService } from './testbed.service';
import { takeUntil, take, filter } from 'rxjs/operators';

@Component({
  selector: 'shh-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  yaml: Observable<string>;

  testbed: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[\w-]*$/)
    ])
  });

  constructor(private preview: PreviewService, private tbService: TestbedService) {
    this.yaml = this.preview.preview;
    this.tbService.testbed
      .pipe(
        filter(tb => !!tb.name),
        take(1)
      )
      .subscribe(tb => this.testbed.controls.name.setValue(tb.name));
  }

  updateTestbedName(): void {
    if (!this.testbed.valid) {
      return;
    }
    this.tbService.updateTestbed({ name: this.testbed.controls.name.value });
  }

  getNameError() {
    return this.testbed.controls.name.hasError('required') ||
      this.testbed.controls.name.hasError('minlength')
      ? 'testbed name must be at least 2 characters'
      : this.testbed.controls.name.hasError('pattern')
      ? 'testbed name must be alphanumeric'
      : '';
  }
}
