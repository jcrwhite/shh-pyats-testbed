import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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

  errorMsg: string;

  connection: { [propName: string]: FormControl } = {
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[\w]*$/)
    ]),
    alias: new FormControl('', [Validators.minLength(2), Validators.pattern(/^[\w]*$/)]),
    class: new FormControl(''),
    via: new FormControl('', [Validators.pattern(/^[\w]*$/)])
  };

  constructor() {}

  ngOnInit(): void {
    combineLatest(
      Object.entries(this.connection).map(([key, control]) =>
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
    return this.connection.name.hasError('required')
      ? 'connection name is required'
      : this.connection.name.hasError('pattern')
      ? 'connection name can not contain spaces or special characters'
      : '';
  }

  getAliasError() {
    return this.connection.alias.hasError('pattern')
      ? 'connection alias can not contain spaces or special characters'
      : '';
  }

  getVIAError() {
    return this.connection.via.hasError('required') || this.connection.via.hasError('minlength')
      ? 'connection OS must be at least 2 characters'
      : '';
  }
}
