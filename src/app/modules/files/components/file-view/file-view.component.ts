import {Component, Input, OnInit} from '@angular/core';
import {FileModel} from '../../models/file.model';

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.scss']
})
export class FileViewComponent implements OnInit {
  @Input() file: FileModel;

  constructor() { }

  ngOnInit(): void {
  }

}
