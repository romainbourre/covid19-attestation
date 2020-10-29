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
      description: 'Déplacements entre le domicile et le lieu d\'exercice de l\'activité professionnelle ou les déplacements professionnels ne pouvant être différés.',
      legal: 'A utiliser par les travailleurs non salariés, lorsqu\'ils ne peuvent disposer d\'un justificatif de déplacement établi par leur employeur.',
      active: false,
    },
    {
      id: 'achats',
      icon: 'shopping_cart',
      title: 'Courses',
      description: 'Déplacements pour effectuer des achats de fournitures nécessaires à l\'activité professionnelle, des achats de première nécessité dans des établissements dont les activités demeurent autorisées (liste sur gouvernement.fr) et les livraisons à domicile.',
      legal: 'Y compris les acquisitions à titre gratuit (distribution de denrées alimentaires...) et les déplacements liés à la perception de prestations sociales et au retrait d\'espèces.',
      active: false,
    },
    {
      id: 'sante',
      icon: 'local_hospital',
      title: 'Consultation médicale',
      description: 'Consultations et soins ne pouvant être assurés à distance et ne pouvant être différés et l’achat de médicaments.',
      active: false,
    },
    {
      id: 'famille',
      icon: 'people',
      title: 'Famille et assistance',
      description: 'Déplacements pour motif familial impérieux, pour l\'assistance aux personnes vulnérables et précaires ou la garde d\'enfants.',
      active: false,
    },
    {
      id: 'handicap',
      icon: 'accessible',
      title: 'Handicap',
      description: 'Déplacements des personnes en situation de handicap et de leur accompagnant.',
      active: false,
    },
    {
      id: 'sport_animaux',
      icon: 'transfer_within_a_station',
      title: 'Sortie brève',
      description: 'Déplacements brefs, dans la limite d\'une heure quotidienne et dans un rayon maximal d\'un kilomètre autour du domicile, liés soit à l\'activité physique individuelle des personnes, à l\'exclusion de toute pratique sportive collective et de toute proximité avec d\'autres personnes, soit à la promenade avec les seules personnes regroupées dans un même domicile, soit aux besoins des animaux de compagnie.',
      active: false,
    },
    {
      id: 'convocation',
      icon: 'gavel',
      title: 'Convocation',
      description: 'Convocation judiciaire ou administrative et rendez-vous dans un service public.',
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
      id: 'enfants',
      icon: 'school',
      title: 'École/Périscolaire',
      description: 'Déplacement pour chercher les enfants à l’école et à l’occasion de leurs activités périscolaires',
      active: false
    }
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
