import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';
import {ActivatedRoute} from '@angular/router';
import {AttestationService} from '../../services/attestation.service';

export class Reason {
  id: string;
  icon: string;
  title: string;
  description: string;
  legal?: string = null;
  active = false;
  positionY: number;
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
      id: 'travail',
      icon: 'work',
      title: 'Travail',
      description: 'Déplacements entre le domicile et le lieu d\'exercice de l\'activité professionnelle ou le lieu d\'enseignement et de formation, déplacements professionnels ne pouvant être différés',
      active: false,
      positionY: 540,
    },
    {
      id: 'sante',
      icon: 'local_hospital',
      title: 'Consultation médicale',
      description: 'Déplacements pour des consultations et soins ne pouvant être assurés à distance et ne pouvant être différés ou pour l\'achat de produits de santé',
      active: false,
      positionY: 508,
    },
    {
      id: 'famille',
      icon: 'people',
      title: 'Famille et assistance',
      description: 'Déplacements pour motif familial impérieux, pour l\'assistance aux personnes vulnérables ou précaires ou pour la garde d\'enfants',
      active: false,
      positionY: 474,
    },
    {
      id: 'handicap',
      icon: 'accessible',
      title: 'Handicap',
      description: 'Déplacements des personnes en situation de handicap et de leur accompagnant',
      active: false,
      positionY: 441,
    },
    {
      id: 'convocation',
      icon: 'gavel',
      title: 'Convocation',
      description: 'Déplacements pour répondre à une convocation judiciaire ou administrative',
      active: false,
      positionY: 418,
    },
    {
      id: 'missions',
      icon: 'sports_kabaddi',
      title: 'Intérêt général',
      description: 'Déplacements pour participer à des missions d\'intérêt général sur demande de l\'autorité administrative',
      active: false,
      positionY: 397,
    },
    {
      id: 'transits',
      icon: 'flight_takeoff',
      title: 'Transits',
      description: 'Déplacements liés à des transits ferroviaires ou aériens pour des déplacements de longues distances',
      active: false,
      positionY: 363,
    },
    {
      id: 'animaux',
      icon: 'pets',
      title: 'Animaux',
      description: 'Déplacements brefs, dans un rayon maximal d\'un kilomètre autour du domicile pour les besoins des animaux de compagnie',
      active: false,
      positionY: 330,
    },
  ];

  constructor(private userService: UserService,
              private route: ActivatedRoute,
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

  switchReason(reason: Reason) {
    reason.active = !reason.active;
  }

  async downloadAttestation() {
    const pdfBlob = await this.attestationService.generateAttestation(this.user, this.reasons);
    const creationDate = new Date().toLocaleDateString('fr-CA');
    const creationHour = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', '-');
    this.downloadBlob(pdfBlob, `attestation-${creationDate}_${creationHour}.pdf`);
  }

  downloadBlob(blob, fileName) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
  }

  atLeastOneSelectedCategory(): boolean {
    return this.reasons.some(r => r.active);
  }
}
