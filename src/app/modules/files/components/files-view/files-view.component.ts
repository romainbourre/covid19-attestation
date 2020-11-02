import { Component, OnInit } from '@angular/core';
import {Files} from '../../models/file.model';
import {files} from '../../data/files.data';

@Component({
  selector: 'app-files-view',
  templateUrl: './files-view.component.html',
  styleUrls: ['./files-view.component.scss']
})
export class FilesViewComponent implements OnInit {
  files: Files = files;

  constructor() { }

  ngOnInit(): void {
  }
}
