import {  Component, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Form } from '../form';
import { DashService } from '../dash.service';
import { EventResponse } from '../master-service';
import { Router } from '@angular/router';


const colors: any = {
  red: {
    primary: '#ad2121',
  },
  blue: {
    primary: '#1e90ff',
  },
  yellow: {
    primary: '#e3bc08',
  }
};

interface FormData {
  data: Form;
}

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./calendar.component.css'],
  templateUrl: './calendar.component.html'
})
export class CalendarComponent {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: string = 'month';

  viewDate: Date = new Date();

  checkedMonth: Set<string>;

  modalData: {
    action: string;
    event: CalendarEvent;
  };



  refresh: Subject<any> = new Subject();

  events: CalendarEvent<FormData>[] = [
    /*
    {
      start:startOfDay(new Date()),
      title: 'David\'s test date',
      color: colors.red,
      meta: { data: new Form(1, 'Equipment', 'Computer') }
    }

    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue
    }
*/
  ];

  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal, private service: DashService, private router: Router) {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ( (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
 	  event.start = newStart;
      event.end = newEnd;
      console.log('Clicked');
        this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
     var theForm = event.meta.data;
     console.log('The event', event);
     console.log('The route:  /editform' + 'category='+ theForm.category +';subcat=' + theForm.subcat + ';id=' + theForm.form_id);
     this.router.navigate(['editform', { category: theForm.category, subcat: theForm.subcat, id: theForm.form_id }]);
  }

  test(){
    this.getCurrentEvents();
  }

  splitMonth(input: string) {
    return input.split('-')[1];
  }

  splitDay(input: string) {
    return input.split('-')[2];
  }

  splitYear(input: string) {
    return input.split('-')[0];
  }

  getCurrentEvents(): void {
    var first = new Date( this.viewDate.getFullYear(), this.viewDate.getMonth(), 1).toDateString();
    if(this.checkedMonth.has(first)){
      return;
    } else {   
        console.log("SEARCHING");
        this.checkedMonth.add(first);   
        this.service.getEvents(this.viewDate).subscribe( (res: EventResponse) => {
        var results = res[0];
        if(results.Equipment){
            results.Equipment.forEach( form => this.events.push({
              start: startOfDay(new Date( parseInt(this.splitYear( form.date),10), 
                                          parseInt(this.splitMonth( form.date),10)-1,
                                          parseInt(this.splitDay( form.date),10))),
              title: form.name,
              color: colors.blue,
              meta: { data: form }
          }))
        }

        if(results.Tools){
          results.Tools.forEach( form => this.events.push({
            start: startOfDay(new Date( parseInt(this.splitYear( form.date),10), 
                                        parseInt(this.splitMonth( form.date),10)-1,
                                        parseInt(this.splitDay( form.date),10))),
            title: form.name,
            color: colors.red,
            meta: { data: form }
          }))
        }

        if(results.Landscape){
          results.Landscape.forEach( form => this.events.push({
              start: startOfDay(new Date( parseInt(this.splitYear( form.date),10), 
                                          parseInt(this.splitMonth( form.date),10)-1,
                                          parseInt(this.splitDay( form.date),10))),
              title: form.name,
              color: colors.green,
              meta: { data: form }
            }))
          }

          this.refresh.next();
      });
    }
  }

  ngOnInit() {
    this.checkedMonth = new Set();
    this.getCurrentEvents();
  }

  addEvent({title, start, end}): void {
      this.events.push({
      	  title: title,
      	  start: start,
    	    end: end,
          color: colors.red,
          draggable: true,
      	  resizable: {
        	beforeStart: true,
        	afterEnd: true
      	  }
      });
      this.refresh.next();
    }
}
