import { Component } from '@angular/core';

interface Task {
  task: string;
  sd: Date;
  ed: Date;
  duration: number;
  priority: number;  // 1 for High, 2 for Medium, 3 for Low
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todo';
  tasks: Task[] = [];
  newTask: Task = { task: '', sd: new Date(), ed: new Date(), duration: 0, priority: 3 }; // Default priority is Low
  modifiedTask: Task = { task: '', sd: new Date(), ed: new Date(), duration: 0, priority: 3 };
  currentTaskName: string = '';

  private colorMap: Map<string, string> = new Map();
  private colors: string[] = ["red", "blue", "yellow", "cyan", "teal", "aqua", "pink"];
  private colorIndex: number = 0;

  addTask(): void {
    const duration = this.calculateDuration(this.newTask.sd, this.newTask.ed);
    const taskToAdd: Task = { ...this.newTask, duration };
    this.tasks.push(taskToAdd);
    this.sortTasks();
    this.assignColor(taskToAdd.task);
    this.resetNewTask();
  }

  modifyTask(): void {
    const taskIndex = this.tasks.findIndex(t => t.task === this.currentTaskName);
    if (taskIndex !== -1) {
      const duration = this.calculateDuration(this.modifiedTask.sd, this.modifiedTask.ed);
      this.tasks[taskIndex] = { ...this.modifiedTask, duration };
      this.sortTasks();
      this.assignColor(this.modifiedTask.task);
      this.resetModifiedTask();
      this.currentTaskName = ''; // Clear the current task name
    }
  }

  deleteTask(task: Task): void {
    this.tasks = this.tasks.filter(t => t !== task);
    this.colorMap.delete(task.task);
  }

  calculateDuration(sd: Date, ed: Date): number {
    const startDate = new Date(sd);
    const endDate = new Date(ed);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  resetNewTask(): void {
    this.newTask = { task: '', sd: new Date(), ed: new Date(), duration: 0, priority: 3 };
  }

  resetModifiedTask(): void {
    this.modifiedTask = { task: '', sd: new Date(), ed: new Date(), duration: 0, priority: 3 };
  }

  assignColor(taskName: string): void {
    if (!this.colorMap.has(taskName)) {
      const color = this.colors[this.colorIndex % this.colors.length];
      this.colorMap.set(taskName, color);
      this.colorIndex++;
    }
  }

  getColor(taskName: string): string {
    return this.colorMap.get(taskName) || 'white';
  }

  sortTasks(): void {
    this.tasks.sort((a, b) => a.priority - b.priority);
  }
}
