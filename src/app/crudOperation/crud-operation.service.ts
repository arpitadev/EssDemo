import { formatDate } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { TsRecord } from '../model/tsRecord';

@Injectable({
  providedIn: 'root'
})
export class CrudOperationService {
 
  constructor(  @Inject(LOCALE_ID) public locale: string,) { }

  getTimesheet(timeSheetList : TsRecord[]){
    
    let data = new Set(timeSheetList.map((item : TsRecord) => item.dateTs));
    let sheet = [];
    data.forEach((date) => {
      sheet.push({
        dateTs: date,
        record: timeSheetList.filter((item : TsRecord) => item.dateTs === date),
      });
    });
    return sheet;
  }

  addRecord(timeSheetList : TsRecord[] , value : TsRecord){
    
    timeSheetList.push(
      value,
    );
    localStorage.setItem('timeSheet', JSON.stringify(timeSheetList));
  }

  updateRecord(timeSheetList: any, value: any, tsTime: any) {
  
    timeSheetList.forEach((record: any, i: number) => {
      if (record)
        if (record.id === value.id) {
          timeSheetList[i] = {
            min: value.min,
            activity: value.activity,
            description: value.description,
            dateTs: formatDate(value['dateTs'], 'MM/dd/yyyy', this.locale),
            hour: value.hour,
            project: value.project,
            time: tsTime,
            id: record.id,
          };
        }
    });

    localStorage.setItem('timeSheet', JSON.stringify(timeSheetList));
  }
}
