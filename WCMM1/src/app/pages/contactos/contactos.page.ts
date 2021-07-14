import { Component, OnInit } from '@angular/core';
import { varSession } from "src/providers/varSession";

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.page.html',
  styleUrls: ['./contactos.page.scss'],
})
export class ContactosPage implements OnInit {

  phoneNumber1: string;
  phoneNumber2: string;
  phoneNumber3: string;


  constructor(public sessionVar: varSession) { 

    if(sessionVar.phone1!="")
      this.phoneNumber1=sessionVar.phone1;
    if(sessionVar.phone2!="")
      this.phoneNumber2=sessionVar.phone2;
    if(sessionVar.phone1!="")
      this.phoneNumber3=sessionVar.phone3;


  }

  ngOnInit() {
  }

  SetNumber1(){
    this.sessionVar.phone1=this.phoneNumber1;
  }

  SetNumber2(){
    this.sessionVar.phone2=this.phoneNumber2;

  }

  SetNumber3(){
    this.sessionVar.phone3=this.phoneNumber3;
 
  }

}
