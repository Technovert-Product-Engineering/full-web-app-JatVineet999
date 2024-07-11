import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { TaskService } from '../../../../services/task.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-header',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule
  ],
  providers: [DatePipe],
  templateUrl: './task-header.component.html',
  styleUrls: ['./task-header.component.css']
})
export class TaskHeaderComponent implements OnInit {
  @Output() deleteAllTasks = new EventEmitter<void>();
  @Output() dateChanged = new EventEmitter<Date>();

  currentDate: string;
  heading: string;
  datepickerVisible = false;
  selectedDate: Date;

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute
  ) {
    this.selectedDate = new Date();
    this.currentDate = this.datePipe.transform(this.selectedDate, 'EEEE, dd MMMM yyyy')!;
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
  onDateChange(date: Date): void {
    this.selectedDate = date;
    this.currentDate = this.datePipe.transform(this.selectedDate, 'EEEE, dd MMMM yyyy')!;
    const today = this.datePipe.transform(new Date(), 'EEEE, dd MMMM yyyy')!;

    if (this.currentDate === today) {
      this.heading = "Today's Tasks";
    } else {
      this.heading = "All Tasks";
    }
    console.log("header:",this.selectedDate);
    this.dateChanged.emit(this.selectedDate);
    this.datepickerVisible = false;
  }

  toggleDatepicker(): void {
    this.datepickerVisible = !this.datepickerVisible;
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
