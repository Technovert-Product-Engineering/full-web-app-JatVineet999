import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GetTask } from '../../../../models/get-task';
import { TaskService } from '../../../../services/task.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: GetTask[] = [];
  selectedTask: GetTask | null = null;
  clickedTask: number | null = null;
  filteredTasks: GetTask[] = [];

  @Output() openEditModal = new EventEmitter<any>();
  @ViewChild('tasksContainer', { static: false }) tasksContainer?: ElementRef;
  @Input() selectedDate: Date;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Initialize selectedDate with the current date
    this.selectedDate = new Date();
    // this.filteredTasks = this.taskService.filteredTasks$;
  }

  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      const filter = urlSegments.join('/');
      this.filterTasks(filter);
    });

    this.taskService.tasks$.subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filterTasks(this.route.snapshot.url.join('/'), this.selectedDate);
      },
      error: (error) => {
        console.error('Failed to fetch tasks', error);
      }
    });

    this.taskService.filteredTasks$.subscribe({
      next: (filteredTasks: GetTask[]) => {
        this.filteredTasks = filteredTasks;
      },
      error: (error) => {
        console.error('Failed to fetch tasks', error);
      }
    });

    this.taskService.getTasksOfUser().subscribe();
  }

  ngOnChanges(): void {
    if (this.selectedDate) {
      this.filterTasks(this.route.snapshot.url.join('/'), this.selectedDate);
    }
  }

  filterTasks(filter: string = '', date: Date | null = null): void {
    this.taskService.filterTasks(filter, date);
  }
  showTaskDetail(task: GetTask, event: MouseEvent): void {
    if (this.clickedTask === task.taskID) {
      this.clickedTask = null; // Close the detail box if clicking the same task
    } else {
      this.selectedTask = task;
      this.clickedTask = task.taskID as number;
    }
  }

  getElapsedTime(createdOn: Date): string {
    const currentTime = new Date();
    const elapsedTime = currentTime.getTime() - new Date(createdOn).getTime();
    const elapsedHours = Math.floor(elapsedTime / (1000 * 60 * 60));

    if (elapsedHours >= 24) {
      const elapsedDays = Math.floor(elapsedHours / 24);
      return `Added ${elapsedDays} days ago`;
    } else {
      return ` Added ${elapsedHours} hours ago`;
    }
  }

  editTask(task: GetTask): void {
    this.openEditModal.emit(task);
  }

  deleteTask(task: GetTask): void {
    if (task.taskID) {
      this.taskService.deleteTask(task.taskID).subscribe({
        next: () => {
          this.selectedTask = null;
          console.log(`Task deleted successfully`);
        },
        error: (error) => {
          console.error('Failed to delete task', error);
        }
      });
    }
  }
  deleteAllFilteredTasks(): void {
    const taskIds = this.filteredTasks.map(task => task.taskID);
    this.taskService.deleteAllTasks(taskIds).subscribe({
      next: () => {
        this.toastr.success('All filtered tasks deleted successfully');
      },
      error: (error) => {
        this.toastr.error('Failed to delete all filtered tasks');
      }
    });
  }


  toggleTaskCompletion(task: GetTask, event: MouseEvent): void {
    event.stopPropagation();

    const updatedTask = {
      ...task,
      isCompleted: !task.isCompleted
    };

    this.taskService.updateTask(task.taskID, updatedTask).subscribe({
      next: () => {
        task.isCompleted = !task.isCompleted;
        this.toastr.success(`Task ${task.isCompleted ? 'Completed' : 'Active'} successfully`);
        this.filterTasks(this.route.snapshot.url.join('/'), this.selectedDate);
      },
      error: (error) => {
        this.toastr.error('Failed to update status of task');
        task.isCompleted = !task.isCompleted;
      }
    });
  }

  closeTaskDetail(): void {
    this.selectedTask = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.tasksContainer && !this.tasksContainer.nativeElement.contains(event.target as Node)) {
      this.closeTaskDetail();
    }
  }

  handleDateChanged(date: Date): void {
    this.selectedDate = date;
    this.filterTasks(this.route.snapshot.url.join('/'), date);
  }
}
