import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PreviewService } from '../preview.service';

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
