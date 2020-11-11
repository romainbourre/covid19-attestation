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

  isCompleteData() {
    return this.globalData
      && this.globalData.casConfirmes
      && this.globalData.hospitalises
      && this.globalData.deces
      && this.globalData.decesEhpad
      && this.globalData.gueris
      && this.globalData.date;
  }

  getConfirmedCases(): string {
    if (this.globalData && this.globalData.casConfirmes) {
      return this.globalData.casConfirmes.toLocaleString();
    }
    return 'Non disponible';
  }

  getHospitalizedCases(): string {
    if (this.globalData && this.globalData.hospitalises) {
      return this.globalData.hospitalises.toLocaleString();
    }
    return 'Non disponible';
  }

  getDeadCases(): string {
    if (this.globalData && this.globalData.deces && this.globalData.decesEhpad) {
      return (this.globalData.deces + this.globalData.decesEhpad).toLocaleString();
    }
    return 'Non disponible';
  }

  getCuredCases(): string {
    if (this.globalData && this.globalData.gueris) {
      return this.globalData.gueris.toLocaleString();
    }
    return 'Non disponible';
  }

}
