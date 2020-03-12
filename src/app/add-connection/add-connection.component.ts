import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
  Input
} from '@angular/core';
import { FormControl, Validators, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { debounceTime, map, startWith, takeUntil, filter } from 'rxjs/operators';
import { Connection } from '../models/device';
import * as ip from 'ip-regex';

export function isIP(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const invalid = !ip({ exact: true }).test(control.value);
    return invalid ? { isIP: { value: control.value } } : null;
  };
}

@Component({
  selector: 'shh-add-connection',
  templateUrl: './add-connection.component.html',
  styleUrls: ['./add-connection.component.scss']
})
export class AddConnectionComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  @Input()
  set ctx(c: Connection) {
    if (c && this.connection.pristine) {
      this.connection.removeControl('name');
      this.connection.setValue({ ...c });
    } else if (!c) {
      this.clear();
    }
  }

  @Output() changes: EventEmitter<Partial<Connection>> = new EventEmitter();

  @Output() valid: EventEmitter<boolean> = new EventEmitter();

  errorMsg: string;

  connection: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[\w-]*$/)
    ]),
    class: new FormControl('', [Validators.minLength(2), Validators.pattern(/^[\w-]*$/)]),
    protocol: new FormControl('', [Validators.minLength(2)]),
    host: new FormControl('', [Validators.minLength(2), Validators.pattern(/^[\w-.]*$/)]),
    ip: new FormControl('', [isIP()]),
    port: new FormControl('', [Validators.minLength(2)])
  });

  @ViewChild('name', { static: false }) nameInput: ElementRef;

  constructor() {}

  ngOnInit(): void {
    this.connection.valueChanges
      .pipe(debounceTime(100), takeUntil(this.unsubscribe))
      .subscribe(changes => {
        this.valid.emit(this.connection.valid);
        if (this.connection.valid) {
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
    this.connection.reset();
  }

  focusName(): void {
    this.nameInput.nativeElement.focus();
  }

  getNameError() {
    return this.connection.controls.name.hasError('required')
      ? 'connection name is required'
      : this.connection.controls.name.hasError('pattern')
      ? 'connection name must be alphanumeric'
      : '';
  }

  getClassError() {
    return this.connection.controls.class.hasError('required') ||
      this.connection.controls.class.hasError('minlength')
      ? 'connection class must be at least 2 characters'
      : this.connection.controls.class.hasError('pattern')
      ? 'connection class must be alphanumeric'
      : '';
  }

  getHostError() {
    return this.connection.controls.host.hasError('required') ||
      this.connection.controls.host.hasError('minlength')
      ? 'connection host must be at least 2 characters'
      : this.connection.controls.host.hasError('pattern')
      ? 'connection host must be alphanumeric'
      : '';
  }

  getVIAError() {
    return this.connection.controls.via.hasError('required') ||
      this.connection.controls.via.hasError('minlength')
      ? 'connection via must be at least 2 characters'
      : '';
  }

  getProtocolError() {
    return this.connection.controls.protocol.hasError('required') ||
      this.connection.controls.protocol.hasError('minlength')
      ? 'connection protocol must be at least 2 characters'
      : '';
  }

  getPortError() {
    return this.connection.controls.port.hasError('required') ||
      this.connection.controls.port.hasError('minlength')
      ? 'connection port must be at least 2 characters'
      : '';
  }

  getIPError() {
    return this.connection.controls.ip.hasError('required')
      ? 'connection ip is required'
      : this.connection.controls.ip.hasError('isIP')
      ? 'connection ip must be a valid v4 or v6 address'
      : '';
  }
}
