import { Component, OnInit } from '@angular/core';
import {StatsService} from '../../services/stats.service';
import {Global} from '../../models/stats-response.model';

@Component({
  selector: 'app-global-stats',
  templateUrl: './global-stats.component.html',
  styleUrls: ['./global-stats.component.scss']
})
export class GlobalStatsComponent implements OnInit {

  globalData: Global;

  constructor(private statsService: StatsService) { }

  ngOnInit(): void {
    this.privateLoadData();
  }

  privateLoadData() {
    this.statsService.getGlobalStats().subscribe((response: Global) => {
      this.globalData = response;
    });
  }

}
