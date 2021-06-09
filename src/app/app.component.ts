import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTaskComponent } from './add-task/add-task.component';
import { AppServiceService } from './app-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public showPanel: boolean = false;
  selectedUser = 0;
  oriuserList: Array<any>;
  userList: Array<any>;
  oritaskList: Array<any>;
  taskList: Array<any>;
  selectedFilter: number = 0;
  filterArray = ['Recent Posted', 'Earlier Posted']
  constructor(private appService: AppServiceService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.fetchUsersList();  
    this.fetchTasks();  
  }

  fetchUsersList(){
    this.appService.getUsers().subscribe((res) => {
      let all = {
        id:0,
        name:'All'
      }
      this.userList = this.oriuserList = (res as any).data;
      this.userList = [all, ...this.oriuserList];
    })
  }

  fetchTasks() {
    this.appService.getTasks().subscribe((res: any) => {
      if(res.status){
        this.oritaskList = res.data
      }
      this.taskList = this.oritaskList;
      this.filterTasks();
    })
  }

  delete(task: any) {
    this.appService.deleteTask(task._id).subscribe((res: any) => {
      if (res.status){
        this.fetchTasks();
      }
    })
  }

  add_edit_Task(action = 'add', task?: any){
    let modalRef = this.modalService.open(AddTaskComponent, {
      size: 'md',
      windowClass:'',
      centered: true
    });
    modalRef.componentInstance.userList = this.oriuserList;
    if(task){
      modalRef.componentInstance.isEdit = true;
      modalRef.componentInstance.taskDetails = task;
    }
    modalRef.result.then((result) => {
      let url: any;
      if(action=='add') {
        url = this.appService.addTask(result);
      } else {
        url = this.appService.updateTask(result, result.id);
      }
      url.subscribe((res: any) => {
        this.fetchTasks();
      })
    }, reason => {});
    
  }
  
  sort(index: number) {
    this.selectedFilter = index;
    this.taskList.sort((a: any,b: any) => {
      let aDate: any = new Date(a.createdAt);
      let bDate: any = new Date(b.createdAt)  
      return this.selectedFilter == 1 ? aDate - bDate : bDate - aDate;
    });
    this.showPanel = false;
  }

  filterTasks(){
    setTimeout(() => {
      if(this.selectedUser == 0){
        this.taskList = this.oritaskList;
      } else {
        let userName = (this.oriuserList.find(x => x.id == this.selectedUser)).name.toLowerCase();
        this.taskList = this.oritaskList.filter(x => x.assigned_to.toLowerCase() == userName || x.assigned_by.toLowerCase() == userName) 
      }
      this.sort(this.selectedFilter);
    }, 200);
  }
  openFilterMenu() {
    this.showPanel = !this.showPanel;
  }
}
