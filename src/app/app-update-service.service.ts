import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AlertController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {
  constructor(private readonly updates: SwUpdate, private alertCtrl: AlertController) {
    this.updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
      this.showAppUpdateAlert();
    });    
  }

  showAppUpdateAlert() {
    const header = 'App Update available';
    const message = 'Choose Ok to update';
    // Use MatDialog or ionicframework's AlertController or similar
    this.presentAlert(header, message);
  }

  doAppUpdate() {
    this.updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });

    this.updates.activateUpdate().then(() => {
      alert("Reloading application");
      document.location.reload();
    });
  }

  async presentAlert(title, message) {
    var self = this;
    const alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Ok',
        handler: () => {
          console.log('Confirm Okay');
          self.doAppUpdate();
        }
      }],
      mode: 'md'
    });
    await alert.present();
  }

}