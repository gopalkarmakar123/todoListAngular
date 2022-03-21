import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError,  } from 'rxjs';
import { catchError, retry , tap} from 'rxjs/operators';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = "https://gopal-todolist.herokuapp.com";
  // private apiUrl = "http://localhost:8000";
  private endpoints = {
    getUrl : this.apiUrl + "/todos",
    saveUrl: this.apiUrl + "/todos/save",
    changeOrderUrl: this.apiUrl + "/todos/changeOrder",
    markedSelectedUrl: this.apiUrl + "/todos/selectTodo",
  };


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    // headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })

  };
  constructor(private httpClient:HttpClient) { }


  getTodos():Observable<Todo[]>{
    return this.httpClient.get<Todo[]>(this.endpoints.getUrl).pipe(
      tap(_ => console.log('fetched todos')),
      catchError(this.handleError<Todo[]>('getTodos',[]))
    );
  }
  addTodo(todo: Todo): Observable<any> {
    return this.httpClient.post<Todo>(this.endpoints.saveUrl, todo, this.httpOptions).pipe(
      tap(_ => console.log(`added todo`,_)),
      catchError(this.handleError<Todo>('addTodo'))
    );
  }
  changeOrder(todo:Todo[]): Observable<any>{
    return this.httpClient.put<Todo[]>(this.endpoints.changeOrderUrl, todo, this.httpOptions).pipe(
      tap(_ => console.log(`chaged todo order`,_)),
      catchError(this.handleError<Todo>('changeOrder'))
    );
  }

  selectTodo(todo:Todo):Observable<any> {
    return this.httpClient.put<Todo>(this.endpoints.markedSelectedUrl , todo , this.httpOptions).pipe(
      tap(_ => console.log("seleted as marked",_),
      catchError(this.handleError<Todo>('selectTodo'))
      )
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    }
  }
}
