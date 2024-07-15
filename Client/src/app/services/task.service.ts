import { Injectable } from "@angular/core";
import { BehaviorSubject, forkJoin, map, Observable, switchMap, tap } from "rxjs";
import { GetTask } from "../models/get-task";
import { CreateTask } from "../models/create-task";
import { ApiServiceService } from "./api-service.service";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = '/Tasks';

  private tasksSubject = new BehaviorSubject<GetTask[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  private filteredTasksSubject = new BehaviorSubject<GetTask[]>([]);
  filteredTasks$ = this.filteredTasksSubject.asObservable();
  constructor(private apiService: ApiServiceService) {
    this.tasks$.subscribe(tasks => {
      this.filteredTasksSubject.next(tasks);
    });
  }

  getTasksOfUser(): Observable<GetTask[]> {
    return this.apiService.get<GetTask[]>(`${this.baseUrl}/tasks`).pipe(
      tap(tasks => this.tasksSubject.next(tasks))
    );
  }

  addTask(task: CreateTask): Observable<GetTask[]> {
    return this.apiService.post<GetTask>(`${this.baseUrl}`, task).pipe(
      switchMap(() => this.apiService.get<GetTask[]>(`${this.baseUrl}/tasks`)),
      tap(tasks => this.tasksSubject.next(tasks))
    );
  }

  updateTask(taskId: number, taskData: Partial<CreateTask>): Observable<GetTask[]> {
    return this.apiService.put<void>(`${this.baseUrl}/${taskId}`, taskData).pipe(
      switchMap(() => this.apiService.get<GetTask[]>(`${this.baseUrl}/tasks`)),
      tap(tasks => this.tasksSubject.next(tasks))
    );
  }


  deleteTask(taskId: number): Observable<GetTask[]> {
    return this.apiService.delete<void>(`${this.baseUrl}/${taskId}`).pipe(
      switchMap(() => this.apiService.get<GetTask[]>(`${this.baseUrl}/tasks`)),
      tap(tasks => this.tasksSubject.next(tasks))
    );
  }

  deleteAllTasks(taskIds: number[]): Observable<GetTask[]> {
    const deleteRequests = taskIds.map(taskId => this.apiService.delete<void>(`${this.baseUrl}/${taskId}`));
    return forkJoin(deleteRequests).pipe(
      switchMap(() => this.apiService.get<GetTask[]>(`${this.baseUrl}/tasks`)),
      tap(tasks => this.tasksSubject.next(tasks))
    );
  }


  filterTasks(filter: string = '', date: Date | null = null): void {
    this.tasks$.subscribe(tasks => {
      let filteredTasks = tasks;

      if (filter === 'tasks/active') {
        filteredTasks = filteredTasks.filter(task => !task.isCompleted);
      } else if (filter === 'tasks/completed') {
        filteredTasks = filteredTasks.filter(task => task.isCompleted);
      }

      if (date) {
        filteredTasks = filteredTasks.filter(task => {
          const taskDate = new Date(task.createdAt);
          return taskDate.toDateString() === date.toDateString();
        });
      }

      this.filteredTasksSubject.next(filteredTasks);
    });
  }


  calculatePercentages(tasks: GetTask[]): { completedPercentage: number, activePercentage: number } {
    const totalTasks = tasks.length;
    if (totalTasks === 0) {
      return { completedPercentage: 0, activePercentage: 0 };
    }
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    const completedPercentage = Math.round((completedTasks / totalTasks) * 100);
    const activePercentage = 100 - completedPercentage;
    return { completedPercentage, activePercentage };
  }

  groupTasksByDate(tasks: GetTask[]): { [date: string]: GetTask[] } {
    return tasks.reduce((groups, task) => {
      const date = new Date(task.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(task);
      return groups;
    }, {} as { [date: string]: GetTask[] });
  }
}
