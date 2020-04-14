import {Component, OnInit} from '@angular/core';
import QRCode from 'qrcode';
import {PDFDocument, StandardFonts} from 'pdf-lib';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';
import {ActivatedRoute} from '@angular/router';
import {DatePipe} from '@angular/common';

export class Reason {
  id: number;
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
      title: 'Travail',
      description: 'Déplacements entre le domicile et le lieu d’exercice de l’activité professionnelle, lorsqu\'ils sont indispensables à l\'exercice d’activités ne pouvant être organisées sous forme de télétravail ou déplacements professionnels ne pouvant être différés.',
      active: false,
    },
    {
      id: 1,
      title: 'Achats nécessaires',
      description: 'Déplacements pour effectuer des achats de fournitures nécessaires à l’activité professionnelle et des achats de première nécessité dans des établissements dont les activités demeurent autorisées (liste sur gouvernement.fr).',
      active: false,
    },
    {
      id: 2,
      title: 'Consultation médical',
      description: 'Consultations et soins ne pouvant être assurés à distance et ne pouvant être différés ; consultations et soins des patients atteints d\'une affection de longue durée.',
      active: false,
    },
    {
      id: 3,
      title: 'Famille et assistance',
      description: 'Déplacements pour motif familial impérieux, pour l’assistance aux personnes vulnérables ou la garde d’enfants.',
      active: false,
    },
    {
      id: 4,
      title: 'Sortie brève et proche',
      description: 'Déplacements brefs, dans la limite d\'une heure quotidienne et dans un rayon maximal d\'un kilomètre autour du domicile, liés soit à l\'activité physique individuelle des personnes, à l\'exclusion de toute pratique sportive collective et de toute proximité avec d\'autres personnes, soit à la promenade avec les seules personnes regroupées dans un même domicile, soit aux besoins des animaux de compagnie.',
      active: false
    },
    {
      id: 5,
      title: 'Convocation',
      description: 'Convocation judiciaire ou administrative',
      active: false,
    },
    {
      id: 6,
      title: 'Intérêt général',
      description: 'Participation à des missions d’intérêt général sur demande de l’autorité administrative.',
      active: false,
    }
  ];

  constructor(private http: HttpClient,
              private userService: UserService,
              private route: ActivatedRoute,
              private datePipe: DatePipe) { }

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
    reason.active = !reason.active;
    console.log(reason);
  }

  public async generateAttestation() {
    const pdfBlob = await this.generatePdf(this.user, '');
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

  public async generateQR(text: string) {
    try {
      const opts = {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
      };
      return await QRCode.toDataURL(text, opts);
    } catch (err) {
      console.error(err);
    }
  }

  public idealFontSize(font, text, maxWidth, minSize, defaultSize) {
    let currentSize = defaultSize;
    let textWidth = font.widthOfTextAtSize(text, defaultSize);

    while (textWidth > maxWidth && currentSize > minSize) {
      textWidth = font.widthOfTextAtSize(text, --currentSize);
    }

    return (textWidth > maxWidth) ? null : currentSize;
  }

  public async generatePdf(user: User, reasons) {
    const creationDate = new Date().toLocaleDateString('fr-FR');
    const creationHour = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');

    const datesortie = creationDate;
    const heuresortie = creationHour;
    const releaseHours = String(heuresortie).substring(0, 2);
    const releaseMinutes = String(heuresortie).substring(3, 5);

    const data = [
      `Cree le: ${creationDate} a ${creationHour}`,
      `Nom: ${user.lastName}`,
      `Prenom: ${user.firstName}`,
      `Naissance: ${this.datePipe.transform(user.birthDate, 'dd/MM/yyyy')} a ${user.birthPlace}`,
      `Adresse: ${user.address} ${user.postalCode} ${user.city}`,
      `Sortie: ${datesortie} a ${releaseHours}h${releaseMinutes}`,
      `Motifs: ${reasons}`,
    ].join('; ');

    const existingPdfBytes = await this.http.get('assets/pdf/certificate.pdf', {responseType: 'arraybuffer'}).toPromise();

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page1 = pdfDoc.getPages()[0];

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const drawText = (text, x, y, size = 11) => {
      page1.drawText(text, { x, y, size, font });
    };

    drawText(`${user.firstName} ${user.lastName}`, 123, 686);
    drawText(this.datePipe.transform(user.birthDate, 'dd/MM/yyyy'), 123, 661);
    drawText(user.birthPlace, 92, 638);
    drawText(`${user.address} ${user.postalCode} ${user.city}`, 134, 613);

    if (this.reasons[0].active) {
      drawText('x', 76, 527, 19);
    }
    if (this.reasons[1].active) {
      drawText('x', 76, 478, 19);
    }
    if (this.reasons[2].active) {
      drawText('x', 76, 436, 19);
    }
    if (this.reasons[3].active) {
      drawText('x', 76, 400, 19);
    }
    if (this.reasons[4].active) {
      drawText('x', 76, 345, 19);
    }
    if (this.reasons[5].active) {
      drawText('x', 76, 298, 19);
    }
    if (this.reasons[6].active) {
      drawText('x', 76, 260, 19);
    }
    let locationSize = this.idealFontSize(font, user.city, 83, 7, 11);

    if (!locationSize) {
      alert('Le nom de la ville risque de ne pas être affiché correctement en raison de sa longueur. ' +
        'Essayez d\'utiliser des abréviations ("Saint" en "St." par exemple) quand cela est possible.');
      locationSize = 7;
    }

    drawText(user.city, 111, 226, locationSize);

    drawText(`${datesortie}`, 92, 200);
    drawText(releaseHours, 200, 201);
    drawText(releaseMinutes, 220, 201);

    // Date création
    drawText('Date de création:', 464, 150, 7);
    drawText(`${creationDate} à ${creationHour}`, 455, 144, 7);

    const generatedQR = await this.generateQR(data);

    const qrImage = await pdfDoc.embedPng(generatedQR);

    page1.drawImage(qrImage, {
      x: page1.getWidth() - 170,
      y: 155,
      width: 100,
      height: 100,
    });

    pdfDoc.addPage();
    const page2 = pdfDoc.getPages()[1];
    page2.drawImage(qrImage, {
      x: 50,
      y: page2.getHeight() - 350,
      width: 300,
      height: 300,
    });

    const pdfBytes = await pdfDoc.save();

    return new Blob([pdfBytes], { type: 'application/pdf' });
  }
}
