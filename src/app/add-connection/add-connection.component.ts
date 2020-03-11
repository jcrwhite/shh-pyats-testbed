import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { debounceTime, map, startWith, takeUntil, filter } from 'rxjs/operators';
import { Connection } from '../models/device';

@Component({
  selector: 'shh-add-connection',
  templateUrl: './add-connection.component.html',
  styleUrls: ['./add-connection.component.scss']
})
export class AddConnectionComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  @Output() changes: EventEmitter<Partial<Connection>> = new EventEmitter();

  @Output() valid: EventEmitter<boolean> = new EventEmitter();

  errorMsg: string;

  connection: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[\w]*$/)
    ]),
    alias: new FormControl('', [Validators.minLength(2), Validators.pattern(/^[\w]*$/)]),
    class: new FormControl(''),
    via: new FormControl('', [Validators.pattern(/^[\w]*$/)])
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
      ? 'connection name can not contain spaces or special characters'
      : '';
  }

  getAliasError() {
    return this.connection.controls.alias.hasError('pattern')
      ? 'connection alias can not contain spaces or special characters'
      : '';
  }

  getVIAError() {
    return this.connection.controls.via.hasError('required') ||
      this.connection.controls.via.hasError('minlength')
      ? 'connection OS must be at least 2 characters'
      : '';
  }
}
