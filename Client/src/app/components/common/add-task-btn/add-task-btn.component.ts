import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-task-btn',
  standalone: true,
  imports: [],
  templateUrl: './add-task-btn.component.html',
  styleUrl: './add-task-btn.component.css'
})
export class AddTaskBtnComponent {
  @Output() openModal = new EventEmitter<void>();

  openAddTaskModal() {
    this.openModal.emit();
  }
}

