import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsersService } from './users.service';
import { environment } from 'src/environments/environment';
import { formatDate } from '../utils/date.utils';
import { getHeaders } from '../utils/headers.utils';
import { WeightRecord } from '../models/weight-records.model';

@Injectable({
  providedIn: 'root'
})
export class WeightRecordsService {

  private userId: string = this.usersService._id;

  constructor(private http: HttpClient, private usersService: UsersService) { }

  getWeightRecords(offset: number, limit: number, startDate: Date, endDate: Date) {
    let url: string = `${environment.base_url}/weight-records?userId=${this.userId}`;
    if (offset) url += `&offset=${offset}`;
    if (limit) url += `&limit=${limit}`;
    if (startDate) url += `&startDate=${formatDate(startDate)}`;
    if (endDate) url += `&endDate=${formatDate(endDate)}`;
    return this.http.get(url, getHeaders());
  }

  createWeightRecord(weightRecord: WeightRecord) {
    weightRecord.user = this.userId;
    return this.http.post(`${environment.base_url}/weight-records`, weightRecord, getHeaders());
  }

  updateWeightRecord(weightRecord: WeightRecord) {
    return this.http.put(`${environment.base_url}/weight-records/${weightRecord._id}`, weightRecord, getHeaders());
  }

  deleteWeightRecord(weightRecordId: string) {
    return this.http.delete(`${environment.base_url}/weight-records/${weightRecordId}`, getHeaders());
  }
}
