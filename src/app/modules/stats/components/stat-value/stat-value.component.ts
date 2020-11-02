import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-stat-value',
  templateUrl: './stat-value.component.html',
  styleUrls: ['./stat-value.component.scss']
})
export class StatValueComponent implements OnInit {
  @Input() name: string;
  @Input() value: string;

  constructor() { }

  ngOnInit(): void {
  }

}
