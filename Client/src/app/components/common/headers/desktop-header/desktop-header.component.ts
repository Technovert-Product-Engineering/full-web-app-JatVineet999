import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AddTaskBtnComponent } from '../../add-task-btn/add-task-btn.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-desktop-header',
  standalone: true,
  imports: [AddTaskBtnComponent, CommonModule, RouterModule],
  templateUrl: './desktop-header.component.html',
  styleUrls: ['./desktop-header.component.css']
})
export class DesktopHeaderComponent implements OnInit {
  isDropdownOpen = false;
  selectedComponent: string = "DashBoard";

  @Output() openModal = new EventEmitter<void>();

  openAddTaskModal() {
    this.openModal.emit();
  }

  headerTitle: string = 'Dashboard';
  usedLink: any;
  options = [
    { optionName: 'Dashboard', link: '/dashboard' },
    { optionName: 'Active', link: '/tasks/active' },
    { optionName: 'Completed', link: '/tasks/completed' }
  ];

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateHeaderTitle();
    });
    this.updateHeaderTitle();
    this.setUsedLinkByPath(this.router.url.substring(1));
  }

  private setUsedLinkByPath(path: string) {
    this.usedLink = this.options.find(option => option.link === path) || this.options[0];
  }

  updateHeaderTitle(): void {
    const currentRoute = this.route.snapshot.firstChild?.url[0]?.path;
    switch (currentRoute) {
      case 'active':
        this.headerTitle = 'Active';
        break;
      case 'completed':
        this.headerTitle = 'Completed';
        break;
      default:
        this.headerTitle = 'Dashboard';
    }
  }

  signOut(): void {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  selectOption(option: any) {
    this.usedLink = option;
    this.selectedComponent = option.optionName;
    this.isDropdownOpen = false;
    this.router.navigate([option.link]);
  }

  get unUsedLink() {
    return this.options.filter(opt => opt.optionName !== this.usedLink.optionName);
  }
}
