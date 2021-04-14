import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent implements OnInit {

  @Input() fromParent;

  editForm = new FormGroup({
    title: new FormControl("", [Validators.required, Validators.minLength(1)])
  });

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log(this.fromParent);
  }

  closeModal(sendData) {
    if (sendData == null) {
      this.activeModal.close();
      return;
    }
    console.log("closed " + sendData.value);
    this.activeModal.close(sendData.value);
  }

  get title() {
    return this.editForm.get("title");
  }

}
