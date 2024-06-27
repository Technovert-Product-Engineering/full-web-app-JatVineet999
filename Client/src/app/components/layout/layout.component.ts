import { Component } from '@angular/core';
import { SidebarComponent } from '../common/sidebar/sidebar.component';
import { DesktopHeaderComponent } from '../common/headers/desktop-header/desktop-header.component';
import { RouterOutlet } from '@angular/router';
import { AddTaskComponent } from '../add-task/add-task.component';
import { CreateTask } from '../../models/create-task';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, DesktopHeaderComponent, RouterOutlet, AddTaskComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  isAddTaskModalOpen = false;
  taskData: any = null;

  openAddTaskModal(task?: CreateTask) {
    this.taskData = task || null;
    this.isAddTaskModalOpen = true;
  }

  closeAddTaskModal() {
    this.isAddTaskModalOpen = false;
    this.taskData = null;
  }

  onRouterOutletActivate(event: any) {
    if (event && event.openEditModal) {
      event.openEditModal.subscribe((task: any) => this.openAddTaskModal(task));
    }
  }

}
