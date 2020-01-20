import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'log-view',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
})
export class LogComponent implements OnInit {

  @Input() log: any;
  @Input() logCategory: string;

  constructor() { }

  ngOnInit() {}

}
