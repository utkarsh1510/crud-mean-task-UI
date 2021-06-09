import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

enum Routes {
  allTasks = '/task/all-tasks',
  addTask = '/task/add',
  updateTask = '/task/edit/',
  deleteTask = '/task/delete/',
  allUsers = '/task/all-users'
}

@Injectable({
  providedIn: 'root' 
})
export class AppServiceService {
  baseUrl = environment.apiBaseUrl;
  constructor(private http:HttpClient) {
   }
  
  getUsers() {
    return this.http.get<Observable<any>>(`${this.baseUrl}${Routes.allUsers}`);
  }

  getTasks() {
    return this.http.get<Observable<any>>(`${this.baseUrl}${Routes.allTasks}`);
  }

  deleteTask(id) {
    return this.http.delete<Observable<any>>(`${this.baseUrl}${Routes.deleteTask}${id}`);
  }

  addTask(data) { 
    return this.http.post<Observable<any>>(`${this.baseUrl}${Routes.addTask}`, data);
  }

  updateTask(data, id) {
    return this.http.put<Observable<any>>(`${this.baseUrl}${Routes.updateTask}${id}`, data);
  }
}
