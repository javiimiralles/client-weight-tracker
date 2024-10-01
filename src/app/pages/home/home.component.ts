import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController } from '@ionic/angular';
import { WeightRecord } from 'src/app/models/weight-records.model';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { ToastService } from 'src/app/services/toast.service';
import { WeightRecordsService } from 'src/app/services/weight-records.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  currentSegment: 'graphic' | 'list' = 'graphic';

  weightRecords: WeightRecord[] = [];
  offset: number = 0;
  limit: number = 10;
  startDate: Date;
  endDate: Date;

  currentWeightRecord: WeightRecord; // registro de peso que se esta actualizando en este momento
  weightRecordForm: FormGroup;

  isModalOpen: boolean = false;

  constructor(
    private weigthRecordsService: WeightRecordsService,
    private exceptionsService: ExceptionsService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit(): void {
    this.weightRecordForm = this.formBuilder.group({
      weight: ['', [Validators.required, Validators.min(0)]],
      date: [this.formatDateToISO(new Date()), [Validators.required]]
    });

    const now = new Date();
    this.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    this.endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    this.loadWeightRecords();
  }

  onSegmentChange(event: CustomEvent) {
    this.currentSegment = event.detail.value;
    if (this.weightRecords == null || this.weightRecords.length == 0) {
      this.loadWeightRecords();
    }
  }

  setCurrentWeightRecord(currentWeightRecord: WeightRecord) {
    this.currentWeightRecord = currentWeightRecord;
    if (currentWeightRecord) {
      this.weightRecordForm.patchValue({
        weight: currentWeightRecord.weight,
        date: this.formatDateToISO(new Date(currentWeightRecord.date))
      });
    } else {
      this.weightRecordForm.reset();
      this.weightRecordForm.patchValue({
        date: this.formatDateToISO(new Date())
      });
    }
  }

  onSave() {
    if (!this.weightRecordForm.valid) {
      return;
    }

    if (!this.currentWeightRecord) {
      this.createWeightRecord();
    } else {
      this.updateWeightRecord();
    }
  }

  async onDelete(id: string, event: Event) {
    event.stopPropagation();
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Eliminar registro de peso',
      mode: 'ios',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteWeightRecord(id);
          }
        }, {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  private loadWeightRecords() {
    this.weigthRecordsService.getWeightRecords(this.offset, this.limit, this.startDate, this.endDate).subscribe({
      next: (res) => {
        this.weightRecords = res['weightRecords'];
      }, error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  private createWeightRecord() {
    const weightRecord: WeightRecord = new WeightRecord(null, this.weightRecordForm.value.date, this.weightRecordForm.value.weight);
    this.weigthRecordsService.createWeightRecord(weightRecord).subscribe({
      next: (res) => {
        this.toastService.presentToast('Registro de peso creado', 'primary');
        this.isModalOpen = false;
        this.loadWeightRecords();
      }, error: (err) => {
        this.exceptionsService.throwError(err);
      }
    });
  }

  private updateWeightRecord() {
    this.currentWeightRecord.weight = this.weightRecordForm.value.weight;
    this.currentWeightRecord.date = this.weightRecordForm.value.date;
    this.weigthRecordsService.updateWeightRecord(this.currentWeightRecord).subscribe({
      next: () => {
        this.toastService.presentToast('Registro de peso actualizado', 'primary');
        this.isModalOpen = false;
        this.loadWeightRecords();
      }, error: (err) => {
        this.exceptionsService.throwError(err);
      }
    });
  }

  private deleteWeightRecord(id: string) {
    this.weigthRecordsService.deleteWeightRecord(id).subscribe({
      next: () => {
        this.toastService.presentToast('Registro de peso eliminado', 'primary');
        this.loadWeightRecords();
      }, error: (err) => {
        this.exceptionsService.throwError(err);
      }
    });
  }

  private formatDateToISO(date: Date) {
    return date.toISOString().split('T')[0];
  }

}
