import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addressform',
  templateUrl: './addressform.component.html',
  styleUrls: ['./addressform.component.css']
})
export class AddressformComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  
  }

  onUpdate(ref:any)
  {
    console.log(ref);
    
  }

}
