import { Component, OnInit } from '@angular/core';
import { Todo } from '../todo';
import { Observable } from 'rxjs';
import { TodoService } from '../todo.service';
import { HttpClient } from '@angular/common/http';
import {CdkDragDrop, copyArrayItem, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent implements OnInit {
  todos : Todo[] = [];
  selectedTodos: Todo[] = [];
  formValue: Todo = {title:'',displayOrder:0,selected:false};
  constructor(private todoService:TodoService, private httpClient:HttpClient) { }
  getTodos(): void{
    this.todoService.getTodos().subscribe(
      (todos:any) =>{
        this.todos = todos.data;
        this.selectedTodos = todos.data.filter((el:any) => {
          return el.selected == true;
        });

      });
      // console.log(this.selectedTodos);


  }
  addTodo(): void {
    this.formValue.title = this.formValue.title.trim();
    this.formValue.displayOrder = this.todos.length +1;
    if (!this.formValue.title) { return; }
    this.todoService.addTodo(this.formValue)
      .subscribe((todo:any) => {
        console.log(todo);
        if(todo.success){
          this.todos.push(todo.insertedData);
          this.formValue =  {title:'',displayOrder:0,selected:false};
        }
      });
  }
  ngOnInit(): void {
    this.getTodos();

  }
  // doSort(event:CdkDragSortEvent<Todo[]>){
  //   console.log("sort",event);

  // }
  drop(event: CdkDragDrop<Todo[]>) {

    if (event.previousContainer === event.container) {
      console.log("change the order");
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // this.todoService.changeOrder(event.container.data.filter((todo:Todo,i)=>{ return todo.displayOrder!= i+1}));
      //let changedOrderTodos = event.container.data.filter((todo:Todo,i)=>{ return todo.displayOrder!= i+1});
      let changedOrderTodos = event.container.data.filter((todo:Todo,i)=>{ return todo.displayOrder!= i+1});
      event.container.data.map((el,idx) => {
        el.displayOrder = idx +1;
      });
      console.log(changedOrderTodos);

      console.log(changedOrderTodos);

      this.todoService.changeOrder(changedOrderTodos).subscribe((data)=>{console.log(data);});

    } else {
      // console.log("move item as selected");
      this.todoService.selectTodo(this.todos[event.previousIndex]).subscribe((result:any)=>{
        // this.selectedTodos.push(result.data);
        copyArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.previousIndex,
        );
        this.todos[event.previousIndex].selected =true;
      });


    }
    /* console.log("drag",event.container.data.filter((todo:Todo,i)=>{ return todo.displayOrder!= i+1}));

    //console.log(event.container.data.filter((todo:Todo,i)=>{ return todo.displayOrder!= i+1}));
        //console.log(this.todos,this.selectedTodos);*/
  }

}
