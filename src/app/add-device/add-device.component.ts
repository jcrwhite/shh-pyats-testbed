import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
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

  @Input()
  set ctx(d: Device) {
    if (d && this.device.pristine) {
      const { connections, ...data } = d;
      this.device.removeControl('name');
      this.device.setValue(data);
    } else if (!d) {
      this.clear();
    }
  }

  @Output() changes: EventEmitter<Partial<Device>> = new EventEmitter();

  @Output() valid: EventEmitter<boolean> = new EventEmitter();

  errorMsg: string;

  device: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[\w]*$/)
    ]),
    alias: new FormControl('', [Validators.minLength(2), Validators.pattern(/^[\w-]*$/)]),
    os: new FormControl('', [Validators.required, Validators.pattern(/^[\w-]*$/)]),
    platform: new FormControl('', [Validators.minLength(2), Validators.pattern(/^[\w-]*$/)]),
    role: new FormControl('', [Validators.minLength(2), Validators.pattern(/^[\w-]*$/)])
    // password: new FormControl('', [
    //   Validators.required,
    //   Validators.minLength(8),
    //   Validators.pattern(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    // ])
  });

  @ViewChild('name', { static: false }) nameInput: ElementRef;

  constructor() {}

  ngOnInit(): void {
    this.device.valueChanges
      .pipe(debounceTime(100), takeUntil(this.unsubscribe))
      .subscribe(changes => {
        this.valid.emit(this.device.valid);
        if (this.device.valid) {
          this.changes.emit(changes);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  clear(): void {
    this.focusName();
    this.device.reset();
  }

  focusName(): void {
    this.nameInput.nativeElement.focus();
  }

  getNameError() {
    return this.device.controls.name.hasError('required') ||
      this.device.controls.name.hasError('minlength')
      ? 'device name must be at least 2 characters'
      : this.device.controls.name.hasError('pattern')
      ? 'device name must be alphanumeric'
      : '';
  }

  getAliasError() {
    return this.device.controls.alias.hasError('minlength')
      ? 'device alias must be at least 2 characters'
      : this.device.controls.alias.hasError('pattern')
      ? 'device alias must be alphanumeric'
      : '';
  }

  getOSError() {
    return this.device.controls.os.hasError('required') ||
      this.device.controls.os.hasError('minlength')
      ? 'device OS must be at least 2 characters'
      : '';
  }

  getPlatformError() {
    return this.device.controls.platform.hasError('required') ||
      this.device.controls.platform.hasError('minlength')
      ? 'device platform must be at least 2 characters'
      : this.device.controls.platform.hasError('pattern')
      ? 'device platform must be alphanumeric'
      : '';
  }

  getRoleError() {
    return this.device.controls.platform.hasError('required') ||
      this.device.controls.platform.hasError('minlength')
      ? 'device platform must be at least 2 characters'
      : this.device.controls.platform.hasError('pattern')
      ? 'device platform must be alphanumeric'
      : '';
  }
}
