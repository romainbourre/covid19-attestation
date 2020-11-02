import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalStatsComponent } from './components/global-stats/global-stats.component';
import { StatValueComponent } from './components/stat-value/stat-value.component';



@NgModule({
    declarations: [GlobalStatsComponent, StatValueComponent],
    exports: [
        GlobalStatsComponent
    ],
    imports: [
        CommonModule
    ]
})
export class StatsModule { }
