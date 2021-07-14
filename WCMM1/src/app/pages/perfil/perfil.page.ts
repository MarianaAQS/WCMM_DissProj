import { Component, OnInit, ViewChild  } from '@angular/core';
import { NavController } from "@ionic/angular";
import { varSession } from "src/providers/varSession";
import { IonRadioGroup } from '@ionic/angular';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})


export class PerfilPage implements OnInit {

  
  @ViewChild('radioGroup') radioGroup: IonRadioGroup
  
  //Get value on ionChange on IonRadioGroup
  selectedRadioGroup:any;
  //Get value on ionSelect on IonRadio item
  selectedRadioItem:any;

  radio_list = [
    {
      id: '1',
      name: 'radio_list',
      value: '1',
      text: 'Female',
      disabled: false,

    }, {
      id: '2',
      name: 'radio_list',
      value: '2',
      text: 'Male',
      disabled: false,

    }, {
      id: '3',
      name: 'radio_list',
      value: '3',
      text: 'Other',
      disabled: false,
  
    },
  ];

  radioGroupChange(event) {
    this.selectedRadioGroup = event.detail;

    

    this.sessionVar.sex=event.detail.value;


  }







  
  nome :  string;
  sobrenome :  string;
  idade :  number;
  



  constructor(public navCtrl: NavController,public sessionVar: varSession) {


    if(sessionVar.firstName!="")
      this.nome=sessionVar.firstName;

    if(sessionVar.lastName!="")
      this.sobrenome=sessionVar.lastName;

    if(sessionVar.age!=0)
      this.idade=sessionVar.age;
      setTimeout(() => {
        this.radioGroup.value =this.sessionVar.sex.toString();
      }, 1000);

  }



  

  ngOnInit() {

  }

  SetName(){
    
    this.sessionVar.firstName=this.nome;
    this.sessionVar.functionUpdateNome();

  }

  SetLastName(){
    this.sessionVar.lastName=this.sobrenome;
    this.sessionVar.functionUpdateNome();
  }

  
  SetAge(){
    this.sessionVar.age=this.idade;
  }





}
 