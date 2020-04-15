import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';
import {ActivatedRoute} from '@angular/router';
import {DatePipe} from '@angular/common';
import {AttestationService} from '../../services/attestation.service';

export class Reason {
  id: number;
  icon: string;
  title: string;
  description: string;
  active = false;
}

@Component({
  selector: 'app-attestation-page',
  templateUrl: './attestation-page.component.html',
  styleUrls: ['./attestation-page.component.scss']
})
export class AttestationPageComponent implements OnInit {

  user: User;

  reasons: Reason[] = [
    {
      id: 0,
      icon: 'work',
      title: 'Travail',
      description: 'Déplacements entre le domicile et le lieu d’exercice de l’activité professionnelle, lorsqu\'ils sont indispensables à l\'exercice d’activités ne pouvant être organisées sous forme de télétravail ou déplacements professionnels ne pouvant être différés.',
      active: false,
    },
    {
      id: 1,
      icon: 'shopping_cart',
      title: 'Achats nécessaires',
      description: 'Déplacements pour effectuer des achats de fournitures nécessaires à l’activité professionnelle et des achats de première nécessité dans des établissements dont les activités demeurent autorisées (liste sur gouvernement.fr).',
      active: false,
    },
    {
      id: 2,
      icon: 'local_hospital',
      title: 'Consultation médicale',
      description: 'Consultations et soins ne pouvant être assurés à distance et ne pouvant être différés ; consultations et soins des patients atteints d\'une affection de longue durée.',
      active: false,
    },
    {
      id: 3,
      icon: 'people',
      title: 'Famille et assistance',
      description: 'Déplacements pour motif familial impérieux, pour l’assistance aux personnes vulnérables ou la garde d’enfants.',
      active: false,
    },
    {
      id: 4,
      icon: 'local_florist',
      title: 'Sortie brève et proche',
      description: 'Déplacements brefs, dans la limite d\'une heure quotidienne et dans un rayon maximal d\'un kilomètre autour du domicile, liés soit à l\'activité physique individuelle des personnes, à l\'exclusion de toute pratique sportive collective et de toute proximité avec d\'autres personnes, soit à la promenade avec les seules personnes regroupées dans un même domicile, soit aux besoins des animaux de compagnie.',
      active: false
    },
    {
      id: 5,
      icon: 'gavel',
      title: 'Convocation',
      description: 'Convocation judiciaire ou administrative',
      active: false,
    },
    {
      id: 6,
      icon: 'sports_kabaddi',
      title: 'Intérêt général',
      description: 'Participation à des missions d’intérêt général sur demande de l’autorité administrative.',
      active: false,
    }
  ];

  constructor(private http: HttpClient,
              private userService: UserService,
              private route: ActivatedRoute,
              private datePipe: DatePipe,
              private attestationService: AttestationService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.id !== null) {
        this.userService.get(parseInt(params.id, 0)).subscribe(user => {
          this.user = user;
        });
      }
    });
  }

  public switchReason(reason: Reason) {
    console.log(reason);
    reason.active = !reason.active;
  }

  public async downloadAttestation() {
    const pdfBlob = await this.attestationService.generateAttestation(this.user, this.reasons);
    const creationDate = new Date().toLocaleDateString('fr-CA');
    const creationHour = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', '-');
    this.downloadBlob(pdfBlob, `attestation-${creationDate}_${creationHour}.pdf`);
  }

  public downloadBlob(blob, fileName) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
  }
}
