import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesViewComponent } from './components/files-view/files-view.component';
import { FileViewComponent } from './components/file-view/file-view.component';



@NgModule({
    declarations: [FilesViewComponent, FileViewComponent],
    exports: [
        FilesViewComponent
    ],
    imports: [
        CommonModule
    ]
})
export class FilesModule { }
