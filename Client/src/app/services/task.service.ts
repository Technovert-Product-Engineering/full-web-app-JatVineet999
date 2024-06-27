import { Injectable } from "@angular/core";
import { BehaviorSubject, forkJoin, Observable, switchMap, tap } from "rxjs";
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

  constructor(private apiService: ApiServiceService) { }

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

  updateTask(taskId: number, taskData: Partial<CreateTask>): Observable<void> {
    return this.apiService.put<void>(`${this.baseUrl}/${taskId}`, taskData).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.value;
        const updatedTasks = currentTasks.map(task => task.taskID === taskId ? { ...task, ...taskData } : task);
        this.tasksSubject.next(updatedTasks);
      })
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
}
