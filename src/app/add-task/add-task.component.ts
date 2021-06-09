import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  userList: Array<any> = [];
  taskDetails: any;
  taskForm:FormGroup;
  isEdit: boolean = false;

  constructor(private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createTaskForm();
    if(this.isEdit){
      this.assignValues();
    }
  }

  createTaskForm(){
    this.taskForm = this.fb.group({
      description: ['', [Validators.required]],
      assigned_to: [null, [Validators.required]],
      assigned_by: [null, [Validators.required]]
    })
  }

  assignValues(){
    this.taskForm.patchValue({
      description: this.taskDetails.description,
      assigned_to: this.getUserfromId(this.taskDetails.assigned_to, false, true),
      assigned_by: this.getUserfromId(this.taskDetails.assigned_by, false, true)
    })
  }

  closeModal(){
    this.modalService.dismissAll();
  }

  save(){
    if(this.taskForm.valid) {
      let task: any = {
        description: this.taskForm.value.description,
        assigned_by: this.getUserfromId(this.taskForm.value.assigned_by),
        assigned_to: this.getUserfromId(this.taskForm.value.assigned_to)
      };
      if(this.isEdit){
        task.id = this.taskDetails._id;
      }
      this.activeModal.close(task)
    }
  }

  getUserfromId(uniqueName: any, isId: boolean = true , shouldReturnId: boolean = false){
    let key = isId ? 'id' : 'name';
    let user = this.userList.find(x => x[key] == uniqueName);
    return (shouldReturnId) ? user.id : user.name;
  }
}
