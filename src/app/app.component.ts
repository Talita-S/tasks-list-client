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
}
