import { Component } from '@angular/core';
import { SidebarItem } from '@/components/sidebar-item/sidebar-item';
import navItems from '@/data/navigation.json';

@Component({
  selector: 'app-sidebar',
  imports: [SidebarItem],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  readonly navItems = navItems
}
