import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) {}

  async presentToast(message: string, color: 'success' | 'warning' | 'danger' | 'primary') {
    const icon = color === 'warning' ? 'alert-circle'
      : color === 'danger' ? 'close-circle'
      : 'checkmark-circle';

    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: color,
      icon: icon
    });

    await toast.present();
  }
}
