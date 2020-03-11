import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'shh-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  yaml: Observable<string>;

  constructor(private preview: PreviewService) {}

  ngOnInit(): void {
    this.yaml = this.preview.preview;
  }
}
