import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from "@ionic/angular";
import { varSession } from "src/providers/varSession";
import { IonRadioGroup } from '@ionic/angular';

@Component({
  selector: 'app-medicacao',
  templateUrl: './medicacao.page.html',
  styleUrls: ['./medicacao.page.scss'],
})
export class MedicacaoPage implements OnInit {

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
      text: 'Never',
      disabled: false,

    }, {
      id: '2',
      name: 'radio_list',
      value: '2',
      text: 'Every day',
      disabled: false,

    }, {
      id: '3',
      name: 'radio_list',
      value: '3',
      text: 'Every week',
      disabled: false,
  
    },{
      id: '4',
      name: 'radio_list',
      value: '5',
      text: 'Every month',
      disabled: false,
  
    },{
      id: '5',
      name: 'radio_list',
      value: '5',
      text: 'Every year',
      disabled: false,
  
    },
  ];

  radioGroupChange(event) {
    this.selectedRadioGroup = event.detail;

    

    this.sessionVar.repeat=event.detail.value;


  }


  nome_med: string;
  dose: string;

  constructor(public navCtrl: NavController,public sessionVar: varSession) {


    if(sessionVar.MedName!="")
      this.nome_med=sessionVar.MedName;

    if(sessionVar.DoseMed!="")
      this.dose=sessionVar.DoseMed;
      
      setTimeout(() => {
        this.radioGroup.value =this.sessionVar.repeat.toString();
      }, 1000);

  }


  ngOnInit() {
  }

  SetName_Med(){
    
    this.sessionVar.MedName=this.nome_med;
    

  }

  SetDose(){
    this.sessionVar.DoseMed=this.dose;
    
  }

}
