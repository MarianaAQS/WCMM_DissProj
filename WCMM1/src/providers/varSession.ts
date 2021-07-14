import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class varSession {

  mensagemSMS: string = "EMERGENCY SOS! Mariana Santos triggered an assistance alert from this approximate location and may be in need of help. You are receiving this message because Mariana has listed you as an emergency contact. \n\nLocation: ";
  profileName: string;
  profilePicture: string = "assets/Mariana_Santos.jpg";
  firstName: string = "Mariana";
  lastName: string = "Santos";
  age: number = 22;
  sex: number = 1;
  phone1: string = "+351962712312";
  phone2: string = "+351...";
  phone3: string = "+351...";
  MedName: string;
  DoseMed: string;
  repeat: number = 2;
  cortisol: number = 2.5;


  constructor() {

    this.functionUpdateNome();
  }

  functionUpdateNome() {
    this.profileName = this.firstName + " " + this.lastName;
  }
}
