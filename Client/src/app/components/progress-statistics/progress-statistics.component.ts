import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-progress-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-statistics.component.html',
  styleUrls: ['./progress-statistics.component.css']
})
export class ProgressStatisticsComponent implements OnInit {
  completedPercentage: number = 0;
  activePercentage: number = 0;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.tasks$.subscribe({
      next: (tasks) => {
        const { completedPercentage, activePercentage } = this.taskService.calculatePercentages(tasks);
        this.completedPercentage = completedPercentage;
        this.activePercentage = activePercentage;
      }
    });
  }
}
