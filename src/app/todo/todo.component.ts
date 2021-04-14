import { Component, OnInit, Renderer2 } from '@angular/core';
import { TodoService } from '../shared/todo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditModalComponent } from '../modals/edit-modal/edit-modal.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  providers: [TodoService]
})
export class TodoComponent implements OnInit {

  todoForm = new FormGroup({
    item: new FormControl(null, Validators.required)
  });

  todoListArray: any[];
  lastAdded: string = ""; //key of the last added/edited element

  constructor(private todoService: TodoService, private modalService: NgbModal, private renderer: Renderer2) {
    // library.addIcons(farCircle);
   }

  ngOnInit(): void {
    this.todoService.getTodoList().snapshotChanges()
    .subscribe(item => {

      this.todoListArray = [];

      item.forEach(el => {
        let x = el.payload.toJSON(); //getting the result as a JSON object as {title:string, isChecked:boolean}
        x['$key'] = el.key; //saving the key in the $key property
        this.todoListArray.push(x);
      });

      //Sorting the array by checked
      this.todoListArray.sort((a,b) => {
          return a.title.localeCompare(b.title);
      });
    }
    );
    
  }

  addTitle(form: FormGroup) {
    // console.log(form.get('item').value);
    let item = form.get('item').value;
    
    if (item == "" || /^\s*$/.test(item)) {
      form.reset();
      return;
    }
    item = this.todoService.addTitle(item);

    console.log("LAST " + item);
    this.lastAdded = item;
    this.scroll();
    form.reset();
  }

  alterCheck($key: string, isChecked: boolean) {
    this.todoService.checkOrUncheck($key, !isChecked);
  }

  //Opens the edit dialog
  openEditModal(item: any) {
    const modalRef = this.modalService.open(EditModalComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        keyboard: false,
        backdrop: 'static'
      });

      console.log(item.title);
      console.log(item.isChecked);

      let data = item;
  
      modalRef.componentInstance.fromParent = data;
      modalRef.result.then((result) => {
        console.log("from modal " + result);

        if (result == null)
          return;
        this.editTitle(item.$key, result);
      }, (reason) => {
        
      });
  }

  editTitle($key: string, title: string) {
    this.todoService.editTitle($key, title);
    this.lastAdded = $key;
    this.scroll();
  }
  
  deleteTitle($key: string) {
    this.todoService.removeTitle($key);
  }
  
  scroll() {
    //Wait a bit so the .lastAdded class is given to an element of the list
    setTimeout(() => {
      const element = document.querySelector(".lastAdded")
      if (element) 
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100);
  }
  
}
