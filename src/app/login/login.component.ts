import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AadhaarService } from '../aadhaar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private us:AadhaarService,private router:Router) { }

  ngOnInit(): void {
  }
  ans:any;
  onChange(ref:any){
    let obj=ref;
    console.log(obj.Aadhaar)
    this.us.getUser(obj.Aadhaar).subscribe(
      res=>{
         this.ans=res['message']
         console.log(this.ans)

        
    },
    err=>{
      console.log(err)
      alert("Something went wrong in registration")
    })
  }
}
