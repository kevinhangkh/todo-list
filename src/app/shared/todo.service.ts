import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  todoList: AngularFireList<any>;

  constructor(private firebasedb: AngularFireDatabase) { }

  getTodoList() {
    this.todoList = this.firebasedb.list('titles');
    return this.todoList;
  }

  addTitle(title: string): any {

    let item = {
      title: title,
      isChecked: false
    };

    // this.todoList.push(item);

    return this.todoList.push(item).key;
  }

  checkOrUncheck($key: string, flag: boolean) {
    this.todoList.update($key, {isChecked: flag});
  }

  removeTitle($key: string) {
    this.todoList.remove($key);
  }

  editTitle($key: string, title:string) {
    this.todoList.update($key, {title: title});
  }
}
