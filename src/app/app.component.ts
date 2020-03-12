import { Component } from '@angular/core';
import { PreviewService } from './preview.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'shh-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  yaml: Observable<string>;

  constructor(private preview: PreviewService) {
    this.yaml = this.preview.preview;
  }
}
