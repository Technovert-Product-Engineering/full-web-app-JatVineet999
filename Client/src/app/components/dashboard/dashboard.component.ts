import { Component, EventEmitter, Output } from '@angular/core';
import { SidebarComponent } from '../common/sidebar/sidebar.component';
import { DesktopHeaderComponent } from '../common/headers/desktop-header/desktop-header.component';
import { CommonModule } from '@angular/common';
import { WelcomeGreetingComponent } from '../welcome-greeting/welcome-greeting.component';
import { ProgressStatisticsComponent } from '../progress-statistics/progress-statistics.component';
import { TaskListComponent } from '../common/tasks/task-list/task-list.component';
import { TaskHeaderComponent } from '../common/tasks/task-header/task-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, DesktopHeaderComponent, WelcomeGreetingComponent, TaskHeaderComponent, TaskListComponent, ProgressStatisticsComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  @Output() openEditModal = new EventEmitter<any>();

  handleOpenEditModal(task: any) {
    this.openEditModal.emit(task);
  }
}
