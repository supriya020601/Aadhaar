import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AadhaarService {

  constructor(private hc:HttpClient) { }
  createUser(obj:any):Observable<any>{
    return this.hc.post("/user/createaadhaar",obj)
  }
  getUser(obj:any):Observable<any>{
    return this.hc.get(`/user/getaadhaar/${obj}`)
  }

}
