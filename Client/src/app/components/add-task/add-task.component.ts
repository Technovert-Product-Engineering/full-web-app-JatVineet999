import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TokenService } from '../../services/token.service';
import { CreateTask } from '../../models/create-task';
import { GetTask } from '../../models/get-task';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() taskData: GetTask | null = null;
  @Output() close = new EventEmitter<void>();

  title: string = '';
  description: string = '';
  titleError: string = '';
  descriptionError: string = '';

  constructor(
    private taskService: TaskService,
    private tokenService: TokenService,
    private toastr: ToastrService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskData'] && changes['taskData'].currentValue) {
      this.title = this.taskData?.title || '';
      this.description = this.taskData?.description || '';
    } else {
      this.clearForm();
    }
  }

  addTask() {
    const newTask: CreateTask = {
      title: this.title,
      description: this.description,
      isCompleted: false,
    };

    this.taskService.addTask(newTask).subscribe({
      next: () => {
        this.closeAddTaskModal();
        this.toastr.success('Task added successfully');

      },
      error: (error) => {
        console.error('Failed to add task', error);
        this.toastr.error('Failed to add task');
      }
    });
  }

  updateTask() {
    if (this.taskData && this.taskData.taskID) {
      const updatedTask: CreateTask = { ...this.taskData, title: this.title, description: this.description };
      this.taskService.updateTask(this.taskData.taskID, updatedTask).subscribe({
        next: () => {
          this.closeAddTaskModal();
          this.toastr.success('Task updated successfully');
        },
        error: (error) => {
          console.error('Failed to update task', error);
          this.toastr.error('Failed to update task');
        }
      });
    }
  }

  handleForm() {
    this.clearErrors();
    if (this.validateForm()) {
      if (this.taskData) {
        this.updateTask();
      } else {
        this.addTask();
      }
    }
  }

  validateForm(): boolean {
    let isValid = true;
    if (!this.title.trim()) {
      this.titleError = 'Title is required';
      isValid = false;
    }
    if (!this.description.trim()) {
      this.descriptionError = 'Description is required';
      isValid = false;
    }
    return isValid;
  }

  clearErrors() {
    this.titleError = '';
    this.descriptionError = '';
  }

  closeAddTaskModal() {
    this.close.emit();
    this.clearForm();
  }

  clearForm() {
    this.title = '';
    this.description = '';
    this.clearErrors();
  }
}
