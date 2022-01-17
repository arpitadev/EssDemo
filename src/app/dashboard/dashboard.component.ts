import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import { DropDownDataService } from '../dropDownData/drop-down-data.service';
import { CrudOperationService } from '../crudOperation/crud-operation.service';
import { TsRecord } from '../model/tsRecord';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  timeSheet: FormGroup;
  public currentDate: string;
  public tempTSList: TsRecord[];
  public submitted: boolean = false;
  public sortingorder: boolean = true;
  public timeSheetList: TsRecord[] = [];
  public minDate = new Date();
  public validDate: boolean = false;
  public validTime: boolean = false;
  public isFuture: boolean = false;
  public isUpdated: boolean = false;
  public isSave: String = 'Save';
  public totalTime: any;
  public total: any;
  public page: number = 1;
  public pageCount: number = 0;
  public searchData: String = '';
  public afterSearch = [];
  activityList: String[];
  projectList: String[];
  themeList: String[];

  constructor(
    private formBuilder: FormBuilder,
    @Inject(LOCALE_ID) public locale: string,
    private dropDownService: DropDownDataService,
    private crudOperation: CrudOperationService
  ) {}

  ngOnInit(): void {
    this.currentDate = formatDate(new Date(), 'MM/dd/yyyy', this.locale); //Give today's date 01/06/2022.
    this.activityList = this.dropDownService.activityList;
    this.projectList = this.dropDownService.projectList;
    this.themeList = this.dropDownService.themeList;
    this.tempTSList =
      localStorage.getItem('timeSheet') == null
        ? []
        : JSON.parse(localStorage.getItem('timeSheet'));
    this.afterSearch = this.tempTSList;
    this.getTimesheet(this.tempTSList);
    this.initializeForm();
  }

  initializeForm() {
    this.timeSheet = this.formBuilder.group({
      employee: [
        { value: 'Arpita Anil Devargaonkar', disabled: true },
        Validators.compose([Validators.required]),
      ],
      id: [null],
      project: [null, Validators.compose([Validators.required])],
      activity: [null, Validators.compose([Validators.required])],
      dateTs: [this.currentDate, Validators.compose([Validators.required])],
      hour: [
        0,
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(3),
        ]),
      ],
      min: [
        0,
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(59),
        ]),
      ],
      description: [null, Validators.compose([Validators.required])],
      onSiteTS: [null],
      tag: [null],
    });
  }

  getTimesheet(timeSheetList) {
    this.timeSheetList = this.crudOperation.getTimesheet(timeSheetList);
    this.getTimeByDate();
    this.getCurrentMonthData();
    this.sortByDate();
    this.total = this.timeSheetList.length;
    this.pageCount = Math.ceil(this.total / 5);
    this.getTotalTime();
  }

  //Calculate time for each date.
  getTimeByDate() {
    var hour: any;
    var min: any;
    hour = 0;
    min = 0;
    this.timeSheetList.forEach((data: any) => {
      data.record.forEach((element) => {
        hour += parseInt(element['hour']);
        min += parseInt(element['min']);
      });

      if (min > 59) {
        hour += Math.trunc(min / 60);
        min = min % 60;
      }
      data.time = hour * 60 + min;
      hour = hour < 10 ? '0' + hour : hour;
      min = min < 10 ? '0' + min : min;

      data.totalTime = hour + ':' + min;
      hour = 0;
      min = 0;
    });
  }

  //Sort dates in array.
  sortByDate() {
    this.sortingorder = !this.sortingorder;
    if (this.sortingorder) {
      this.timeSheetList = this.timeSheetList.sort(function (a, b) {
        return a.dateTs < b.dateTs ? -1 : a.dateTs > b.dateTs ? 1 : 0;
      });
    } // Ascending
    else {
      this.timeSheetList = this.timeSheetList.sort(function (a, b) {
        return a.dateTs < b.dateTs ? 1 : a.dateTs > b.dateTs ? -1 : 0;
      });
    } // Descending
  }

  getTotalTime() {
    var hour: any;
    var min: any;
    hour = 0;
    min = 0;
    this.timeSheetList.forEach((data: any) => {
      data.record.forEach((element) => {
        hour += parseInt(element['hour']);
        min += parseInt(element['min']);
      });
    });
    if (min > 59) {
      hour += Math.trunc(min / 60);
      min = min % 60;
    }
    hour = hour < 10 ? '0' + hour : hour;
    min = min < 10 ? '0' + min : min;

    this.totalTime = hour + ':' + min;
  }

  getCurrentMonthData() {
    var date = new Date();
    var from = new Date(date.getFullYear(), date.getMonth(), 1);
    var to = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.timeSheetList = this.timeSheetList.filter((record: any) => {
      var check = new Date(record.dateTs);
      return check >= from && check <= to;
    });
  }

  editTS(data: TsRecord) {
    debugger;
    this.isSave = 'Update';
    this.timeSheet.patchValue({
      min: data.min,
      activity: data.activity,
      dateTs: data.dateTs,
      description: data.description,
      hour: data.hour,
      project: data.project,
      id: data.id,
    });
  }

  changeHour(action: string) {
    var newHour: number;
    if (action == '+') {
      if (this.timeSheet.value.hour < 3) {
        newHour = this.timeSheet.value.hour + 1;
        this.timeSheet.controls.hour.setValue(newHour);
      }
    } else {
      if (this.timeSheet.value.hour > 0) {
        newHour = this.timeSheet.value.hour - 1;
        this.timeSheet.controls.hour.setValue(newHour);
      }
    }
  }

  changeMin(action: string) {
    var newMin: number;
    if (action == '+') {
      if ((this.timeSheet.value.min as number) < 60) {
        newMin = this.timeSheet.value.min + 1;
        this.timeSheet.controls.min.setValue(newMin);
      }
    } else {
      if (this.timeSheet.value.min > 0) {
        newMin = this.timeSheet.value.min - 1;
        this.timeSheet.controls.min.setValue(newMin);
      }
    }
  }

  clearForm() {
    this.submitted = false;
    this.isSave = 'Save';
    this.timeSheet.patchValue({
      min: 0,
      activity: null,
      dateTs: this.currentDate,
      description: null,
      hour: 0,
      project: null,
    });
  }

  checkDate(date: any) {
    this.validDate = false;
    this.isFuture = false;
    var startOfWeek = formatDate(
      moment().startOf('week').toDate(),
      'MM/dd/yyyy',
      this.locale
    );
    var endOfWeek = formatDate(new Date(), 'MM/dd/yyyy', this.locale);
    var d1 = startOfWeek.split('/');
    var d2 = endOfWeek.split('/');
    var c = date.split('/');

    var from = new Date(parseInt(d1[2]), parseInt(d1[1]) - 1, parseInt(d1[0]));
    var to = new Date(parseInt(d2[2]), parseInt(d2[1]) - 1, parseInt(d2[0]));
    var check = new Date(c[2], parseInt(c[1]) - 1, c[0]);
    if (check > to) {
      this.isFuture = true;
    } else if (!(check >= from && check <= to)) {
      this.validDate = true;
    }
  }

  checkTime(timeSheetList: any[], value: any) {
    var hour = 0;
    var min = 0;
    timeSheetList.find((data: any, i: string | number) => {
      if (
        data.date === formatDate(value['dateTs'], 'MM/dd/yyyy', this.locale)
      ) {
        data.record.forEach((tsData: any) => {
          if (tsData.id === value.id) {
            hour = tsData.hour;
            min = tsData.min;
            return;
          } // If edit functionality get previous time.
        });
        var time =
          data.time + (value['hour'] - hour) * 60 + (value['min'] - min); // If edit functionality take difference of previous time and current time.
        if (time > 14 * 60) {
          this.validTime = true;
        }
      }
    });
    return this.validTime;
  }

  searchRecord() {
    if (this.searchData === '') {
      this.tempTSList = this.afterSearch;
    } else {
      this.tempTSList = this.tempTSList.filter((res: TsRecord) => {
        return res['project']
          .toLocaleLowerCase()
          .match(this.searchData.toLocaleLowerCase());
      });
    }
    this.getTimesheet(this.tempTSList);
  }

  expandRow(data: any) {
    data['isExpanded'] = !data['isExpanded'];
  }

  submitForm($event: any, value: any) {
    this.submitted = true;
    this.isUpdated = false;
    this.validTime = false;
    debugger;
    var tempList =
      localStorage.getItem('timeSheet') == null
        ? []
        : JSON.parse(localStorage.getItem('timeSheet'));

    this.checkDate(formatDate(value['dateTs'], 'MM/dd/yyyy', this.locale));
    if (this.validDate || this.isFuture) {
      return;
    }

    this.checkTime(this.timeSheetList, value);
    if (this.validTime) {
      return;
    }

    if (this.timeSheet.invalid || (value.min == 0 && value.hour == 0)) {
      return;
    }

    if (value.hour >= 3 && value.min > 0) {
      value['min'] = 0;
    }
    let hours = value['hour'];
    let minutes = value['min'];
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let tsTime = hours + ':' + minutes;

    !value.id
      ? this.addRecord(value, tempList, tsTime)
      : this.updateRecord(value, tempList, tsTime);

    this.isSave = 'Save';
    this.sortingorder = true;
    var timeSheetList =
      localStorage.getItem('timeSheet') == null
        ? []
        : JSON.parse(localStorage.getItem('timeSheet'));
    this.getTimesheet(timeSheetList);
  }

  //Add new entry to TS.
  addRecord(value: any, timeSheetList: any, tsTime: any) {
    value['id'] = timeSheetList.length + 1;
    value['time'] = tsTime;
    value['dateTs'] = formatDate(value['dateTs'], 'MM/dd/yyyy', this.locale);
    this.crudOperation.addRecord(timeSheetList, value);
    this.isUpdated = true;
    this.timeSheet.patchValue({
      min: 0,
      activity: null,
      dateTs: this.currentDate,
      description: null,
      hour: 0,
      project: null,
      id: null,
    });
  }

  //Update particular entry of TS.
  updateRecord(value: any, timeSheetList: any, tsTime: any) {
    this.crudOperation.updateRecord(timeSheetList, value, tsTime);
    this.isUpdated = true;
    this.isSave = 'Save';
    this.timeSheet.patchValue({
      min: 0,
      activity: null,
      dateTs: this.currentDate,
      description: null,
      hour: 0,
      project: null,
      id: null,
    });
    this.submitted = false;
  }
}
