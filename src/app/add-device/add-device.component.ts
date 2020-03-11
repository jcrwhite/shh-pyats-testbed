import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { debounceTime, map, startWith, takeUntil, filter } from 'rxjs/operators';
import { Device, Connection } from '../models/device';

@Component({
  selector: 'shh-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss']
})
export class AddDeviceComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  @Output() changes: EventEmitter<Partial<Device>> = new EventEmitter();

  errorMsg: string;

  device: { [propName: string]: FormControl } = {
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[\w]*$/)
    ]),
    alias: new FormControl('', [Validators.minLength(2), Validators.pattern(/^[\w]*$/)]),
    os: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    ])
  };

  constructor() {}

  ngOnInit(): void {
    combineLatest(
      Object.entries(this.device).map(([key, control]) =>
        control.valueChanges.pipe(
          filter(() => control.valid),
          map(change => ({ [key]: change })),
          startWith({})
        )
      )
    )
      .pipe(
        debounceTime(100),
        map(changes => changes.reduce((accu, change) => ({ ...accu, ...change }), {})),
        takeUntil(this.unsubscribe)
      )
      .subscribe(changes => this.changes.emit(changes));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getNameError() {
    return this.device.name.hasError('required') || this.device.name.hasError('minlength')
      ? 'device name must be at least 2 characters'
      : this.device.name.hasError('pattern')
      ? 'device name can not contain spaces or special characters'
      : '';
  }

  getAliasError() {
    return this.device.alias.hasError('minlength')
      ? 'device alias must be at least 2 characters'
      : this.device.alias.hasError('pattern')
      ? 'device alias can not contain spaces or special characters'
      : '';
  }

  getOSError() {
    return this.device.os.hasError('required') || this.device.os.hasError('minlength')
      ? 'device OS must be at least 2 characters'
      : '';
  }
}
