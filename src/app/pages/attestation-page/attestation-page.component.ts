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
      id: 'travail',
      icon: 'work',
      title: 'Travail/Formation',
      description: 'Déplacements entre le domicile et le lieu d\'exercice de l\'activité professionnelle ou le lieu d’enseignement et de formation',
      active: false,
    },
    {
      id: 'sante',
      icon: 'local_hospital',
      title: 'Consultation médicale',
      description: 'Consultations et soins ne pouvant être assurés à distance et ne pouvant être différés ; consultations et soins des patients atteints d\'une affection de longue durée et l’achat de médicaments',
      active: false,
    },
    {
      id: 'famille',
      icon: 'people',
      title: 'Famille et assistance',
      description: 'Déplacements pour motif familial impérieux, pour l\'assistance aux personnes vulnérables et précaires ou la garde d\'enfants',
      active: false,
    },
    {
      id: 'handicap',
      icon: 'accessible',
      title: 'Handicap',
      description: 'Déplacements des personnes en situation de handicap et leur accompagnant',
      active: false,
    },
    {
      id: 'convocation',
      icon: 'gavel',
      title: 'Convocation',
      description: 'Convocation judiciaire ou administrative',
      active: false,
    },
    {
      id: 'missions',
      icon: 'sports_kabaddi',
      title: 'Intérêt général',
      description: 'Participation à des missions d’intérêt général sur demande de l’autorité administrative.',
      active: false,
    },
    {
      id: 'transits',
      icon: 'commute',
      title: 'Transits',
      description: 'Déplacements liés à des transits pour des déplacements de longues distances',
      active: false
    },
    {
      id: 'animaux',
      icon: 'pets',
      title: 'Animaux',
      description: 'Déplacements brefs, dans un rayon maximal d\'un kilomètre autour du domicile pour les besoins des animaux de compagnie',
      active: false
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

  public switchReason(reason: Reason) {
    this.reasons.forEach(r => r.active = false);
    reason.active = true;
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
