import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddDeviceComponent } from './add-device/add-device.component';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { PreviewComponent } from './preview/preview.component';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { AddConnectionComponent } from './add-connection/add-connection.component';

export function getHighlightLanguages() {
  return {
    yaml: () => import('highlight.js/lib/languages/yaml')
  };
}

@NgModule({
  declarations: [AppComponent, AddDeviceComponent, PreviewComponent, AddConnectionComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HighlightModule
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        languages: getHighlightLanguages()
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
