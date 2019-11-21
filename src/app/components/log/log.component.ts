import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
})
export class LogComponent {
  data = {
    items: [1,2,3,4,5,67,8,75,4,3]
  }  //@Input() data: any;
  @Input() events: any;
  // @ViewChild(Content) content: Content;

  constructor() { }

  onEvent(event: string, item: any, e: any) {
    if (this.events[event]) {
      this.events[event](item);
    }
  }

  toggleGroup(group: any) {
    group.show = !group.show;
  }

  isGroupShown(group: any) {
    return group.show;
  }

}
