import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AlertController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {
  constructor(private readonly updates: SwUpdate, private alertCtrl: AlertController) {
    this.updates.available.subscribe(event => {
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
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Ok',
        handler: () => {
          console.log('Confirm Okay');
          self.doAppUpdate;
        }
      }],
      mode: 'md'
    });
    await alert.present();
  }

}