import { Component, EventEmitter, Output } from '@angular/core';
import { AddTaskBtnComponent } from '../add-task-btn/add-task-btn.component';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AddTaskBtnComponent, RouterLink, AddTaskBtnComponent, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Output() openModal = new EventEmitter<void>();

  openAddTaskModal() {
    this.openModal.emit();
  }
}
