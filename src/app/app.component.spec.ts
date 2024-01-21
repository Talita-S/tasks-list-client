import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {
  HttpClient,
  HttpClientModule,
  HttpResponse,
} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientModule, ReactiveFormsModule],
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'tasks-list'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('tasks-list');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a')?.textContent).toContain(
      'GERENCIAMENTO DE TAREFAS'
    );
  });

  it('should add a task successfully', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const httpClient = TestBed.inject(HttpClient);
    spyOn(httpClient, 'post').and.returnValue(of({} as HttpResponse<Response>));

    app.description.setValue('Test Task');

    app.addTask();

    expect(httpClient.post).toHaveBeenCalled();
    expect(app.openCollapse).toBe(false);
    expect(app.showText).toBe(true);
    expect(app.showAddSuccess).toBe(true);
  });

  it('should handle error when adding a task', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const httpClient = TestBed.inject(HttpClient);
    spyOn(httpClient, 'post').and.returnValue(
      throwError(() => new Error('error'))
    );

    app.description.setValue('Test Task');

    app.addTask();

    expect(httpClient.post).toHaveBeenCalled();
    expect(app.showFailure).toBe(true);
  });
});
