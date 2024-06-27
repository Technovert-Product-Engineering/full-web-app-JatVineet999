import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { TokenService } from '../../../../services/token.service';
import { TaskService } from '../../../../services/task.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GetTask } from '../../../../models/get-task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: GetTask[] = [];
  selectedTask: GetTask| null = null;
  clickedTask: number | null = null;
  filteredTasks: GetTask[] = [];

  @Output() openEditModal = new EventEmitter<any>();
  @ViewChild('tasksContainer', { static: false }) tasksContainer?: ElementRef;

  constructor(
    private tokenService: TokenService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      const filter = urlSegments.join('/');
      this.filterTasks(filter);
    });

    this.taskService.tasks$.subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.sortTasks();
        this.filterTasks(this.route.snapshot.url.join('/'));
      },
      error: (error) => {
        console.error('Failed to fetch tasks', error);
      }
    });

    // Initial load of tasks
    this.taskService.getTasksOfUser().subscribe();
  }

  filterTasks(filter: string = ''): void {
    if (filter === 'tasks/active') {
      this.filteredTasks = this.tasks.filter(task => task.isCompleted === false);
    } else if (filter === 'tasks/completed') {
      this.filteredTasks = this.tasks.filter(task => task.isCompleted === true);
    } else {
      this.filteredTasks = this.tasks;
    }
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
          console.log(`Task ${task.taskID} deleted successfully`);
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
        console.log('All filtered tasks deleted successfully');
      },
      error: (error) => {
        console.error('Failed to delete all filtered tasks', error);
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
        this.filterTasks(this.route.snapshot.url.join('/'));
      },
      error: (error) => {
        console.error('Failed to update task', error);
        task.isCompleted = !task.isCompleted; // Revert on error
      }
    });
  }

  closeTaskDetail(): void {
    this.selectedTask = null;
  }

  private sortTasks(): void {
    this.tasks.sort((a, b) => {
      if (a.isCompleted === b.isCompleted) {
        return 0; 
      }
      return a.isCompleted ? 1 : -1; 
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.tasksContainer && !this.tasksContainer.nativeElement.contains(event.target as Node)) {
      this.closeTaskDetail();
    }
  }
}
