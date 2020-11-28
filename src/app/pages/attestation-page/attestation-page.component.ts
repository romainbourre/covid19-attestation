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
      description: 'Déplacements entre le domicile et le lieu d’exercice de l’activité professionnelle ou un établissement d’enseignement ou de formation; déplacements professionnels ne pouvant être différés; déplacements pour un concours ou un examen',
      legal: 'A utiliser par les travailleurs non salariés, lorsqu\'ils ne peuvent disposer d\'un justificatif de déplacement établi par leur employeur.',
      active: false,
    },
    {
      id: 'achats_culturel_cultuel',
      icon: 'shopping_cart',
      title: 'Courses',
      description: 'Déplacements pour se rendre dans un établissement culturel autorisé ou un lieu de culte; déplacements pour effectuer des achats de biens, pour des services dont la fourniture est autorisée, pour les retraits de commandes et les livraisons à domicile;',
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
      description: 'Déplacements en plein air ou vers un lieu de plein air, sans changement du lieu de résidence, dans la limite de trois heures quotidiennes et dans un rayon maximal de vingt kilomètres autour du domicile, liés soit à l’activité physique ou aux loisirs individuels, à l’exclusion de toute pratique sportive collective et de toute proximité avec d’autres personnes, soit à la promenade avec les seules personnes regroupées dans un même domicile, soit aux besoins des animaux de compagnie;',
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
