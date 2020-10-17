import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-people-form',
  templateUrl: './people-form.component.html',
  styleUrls: ['./people-form.component.scss']
})
export class PeopleFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Output() submitted = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  public onSubmit() {
    this.submitted.emit();
  }
}
