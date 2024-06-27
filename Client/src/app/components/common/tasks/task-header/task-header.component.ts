import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { TaskService } from '../../../../services/task.service';

@Component({
  selector: 'app-task-header',
  standalone: true,
  imports: [],
  providers: [DatePipe],
  templateUrl: './task-header.component.html',
  styleUrl: './task-header.component.css'
})
export class TaskHeaderComponent implements OnInit {
  @Output() deleteAllTasks = new EventEmitter<void>();

  currentDate: string;
  heading: string;

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute
  ) {
    this.currentDate = this.datePipe.transform(new Date(), 'EEEE, dd MMMM yyyy')!;
    this.heading = "Today's Tasks";
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateHeading();
      });

    this.updateHeading();
  }

  onDeleteAllTasks(): void {
    this.deleteAllTasks.emit();
  }

  updateHeading(): void {
    const currentRoute = this.activatedRoute.snapshot.url.join('/');
    if (currentRoute === 'tasks/active') {
      this.heading = "Today's Active Tasks";
    } else if (currentRoute === 'tasks/completed') {
      this.heading = "Today's Completed Tasks";
    } else {
      this.heading = "Today's Tasks";
    }
  }
}
