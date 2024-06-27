import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { TaskHeaderComponent } from '../common/tasks/task-header/task-header.component';
import { TaskListComponent } from '../common/tasks/task-list/task-list.component';
import { GetTask } from '../../models/get-task';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskHeaderComponent, TaskListComponent],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
  @Output() openEditModal = new EventEmitter<any>();
  @ViewChild(TaskListComponent) taskListComponent!: TaskListComponent;

  handleOpenEditModal(task: GetTask) {
    this.openEditModal.emit(task);
  }

  handleDeleteAllTasks() {
    this.taskListComponent.deleteAllFilteredTasks();
  }
}
