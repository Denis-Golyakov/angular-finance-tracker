import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import 'iconify-icon';
import { Sidebar } from '@/components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
}
