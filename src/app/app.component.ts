import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Task } from './request/task';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'tasks-list';
  showText = true;
  openCollapse = false;
  showAddSuccess = false;
  showUpdateSuccess = false;
  showDeleteSuccess = false;
  showFailure = false;
  tasks: any = [];

  baseUrl = 'http://localhost:8080/tasks';

  description = new FormControl('', Validators.required);
  updateDescription = new FormControl('', Validators.required);
  finishedTask: boolean = false;
  done!: boolean;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getTasks();
  }

  addTask(): void {
    this.description.markAsTouched();
    let task: Task = {
      description: this.description.value!,
      done: false,
    };

    this.http
      .post<HttpResponse<Response>>(this.baseUrl, JSON.stringify(task), {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .subscribe(
        () => {
          this.tasks.push(task);

          this.openCollapse = false;
          this.showText = true;
          this.showAddSuccess = true;
          this.description.setValue('');
          setTimeout(() => {
            this.showAddSuccess = false;
          }, 3000);
        },
        (error) => {
          this.showFailure = true;
          setTimeout(() => {
            this.showFailure = false;
          }, 3000);

          console.log(error);
        }
      );
  }

  getTasks(): void {
    this.http.get(this.baseUrl).subscribe(
      (data) => {
        this.tasks = data || [];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  updateTask(id: number, isFinished: boolean): void {
    if (this.updateDescription.errors) {
      return;
    }
    let updatedTask: Task = {
      description: this.updateDescription.value!,
      done: isFinished,
    };

    this.http
      .put<HttpResponse<Response>>(
        this.baseUrl + `/${id}`,
        JSON.stringify(updatedTask),
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .subscribe(
        () => {
          const index = this.tasks.findIndex(
            (task: { id: number }) => task.id === id
          );
          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }

          this.showUpdateSuccess = true;
          setTimeout(() => {
            this.showUpdateSuccess = false;
          }, 3000);
        },
        (error) => {
          this.showFailure = true;
          setTimeout(() => {
            this.showFailure = false;
          }, 3000);
          console.log(error);
        }
      );
  }

  deleteTask(id: number): void {
    this.http.delete<HttpResponse<Response>>(this.baseUrl + `/${id}`).subscribe(
      () => {
        this.tasks = this.tasks.filter(
          (task: { id: number }) => task.id !== id
        );

        this.showDeleteSuccess = true;
        setTimeout(() => {
          this.showDeleteSuccess = false;
        }, 3000);
      },
      (error) => {
        this.showFailure = true;
        setTimeout(() => {
          this.showFailure = false;
        }, 3000);
        console.log(error);
      }
    );
  }
}
