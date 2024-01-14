import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Task } from './requisicao/task';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'tasks-list';
  showText = true;
  openCollapse = false;
  showSuccess = false;
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
          this.openCollapse = false;
          this.showText = true;
          this.showSuccess = true;
          this.description.setValue('');
          setTimeout(() => {
            this.showSuccess = false;
          }, 5000);
          window.location.reload();
        },
        (error) => {
          this.showFailure = true;
          setTimeout(() => {
            this.showFailure = false;
          }, 5000);
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
          this.showSuccess = true;
          setTimeout(() => {
            this.showSuccess = false;
          }, 5000);
          window.location.reload();
        },
        (error) => {
          this.showFailure = true;
          setTimeout(() => {
            this.showFailure = false;
          }, 5000);
          console.log(error);
        }
      );
  }
}
