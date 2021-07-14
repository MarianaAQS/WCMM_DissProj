import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';

import { Camera} from '@ionic-native/camera/ngx';
import { varSession } from "src/providers/varSession";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  imgURL;

  constructor(
    private menu: MenuController,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    public sessionVar: varSession
    ) {}

    openFirst() {
      this.menu.enable(true, 'first');
      this.menu.open('first');
    }
  
    openEnd() {
      this.menu.open('end');
    }
  
    openCustom() {
      this.menu.enable(true, 'custom');
      this.menu.open('custom');
    }

    takePicture(){
      this.camera.getPicture({
        quality: 100,
        sourceType: this.camera.PictureSourceType.CAMERA,
        destinationType: this.camera.DestinationType.FILE_URI}).then((res) => {
        this.imgURL = res;
      }).catch(e => {
        console.log(e);
      })
    }
  
    getGallery(){
      this.camera.getPicture({
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL}).then((res) => {
        this.imgURL = 'data:image/jpeg;base64,' + res;;
      }).catch(e => {
        console.log(e);
      })
    }

    async openActionSheet() {
      const actionSheet = await this.actionSheetController.create({
        header: 'Add picture with',
        cssClass: 'my-custom-class',
        mode: 'ios',
        buttons: [{
          text: 'Camera Roll',
          //icon: 'camera',
          handler: () => {
            console.log('Camera clicked');
            this.takePicture();
          }
        }, {
          text: 'Gallery',
          //icon: 'image',
          handler: () => {
            console.log('Gallery clicked');
            this.getGallery();
          }
        }, {
          text: 'Cancel',
          //icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
      });
      await actionSheet.present();
  
      const { role } = await actionSheet.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
    }

  }
