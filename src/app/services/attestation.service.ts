import { Injectable } from '@angular/core';
import {User} from '../models/user.model';
import {PDFDocument, rgb, StandardFonts} from 'pdf-lib';
import QRCode from 'qrcode';
import {HttpClient} from '@angular/common/http';
import {Reason} from '../pages/attestation-page/attestation-page.component';
import {DateFormatPipe} from '../pipes/date-format.pipe';

@Injectable({
  providedIn: 'root'
})
export class AttestationService {

  constructor(private http: HttpClient) { }

  public idealFontSize(font, text, maxWidth, minSize, defaultSize) {
    let currentSize = defaultSize;
    let textWidth = font.widthOfTextAtSize(text, defaultSize);

    while (textWidth > maxWidth && currentSize > minSize) {
      textWidth = font.widthOfTextAtSize(text, --currentSize);
    }

    return (textWidth > maxWidth) ? null : currentSize;
  }

  public async generateAttestation(user: User, reasons: Reason[]) {
    const creationDate = new Date().toLocaleDateString('fr-FR');
    const creationHour = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');

    const datesortie = creationDate;
    const heuresortie = creationHour;
    const releaseHours = String(heuresortie).substring(0, 2);
    const releaseMinutes = String(heuresortie).substring(3, 5);
    const activeReasonsLabels = reasons
      .filter(r => r.active === true)
      .map(r => r.id)
      .join(', ');

    const data = [
      `Cree le: ${creationDate} a ${creationHour}`,
      `Nom: ${user.lastName}`,
      `Prenom: ${user.firstName}`,
      `Naissance: ${user.birthDate} a ${user.birthPlace}`,
      `Adresse: ${user.address} ${user.postalCode} ${user.city}`,
      `Sortie: ${datesortie} a ${releaseHours}h${releaseMinutes}`,
      `Motifs: ${activeReasonsLabels}`
    ].join(';\n');

    const existingPdfBytes = await this.http.get('assets/pdf/certificate.pdf', {responseType: 'arraybuffer'}).toPromise();

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    pdfDoc.setTitle('COVID-19 - Déclaration de déplacement');
    pdfDoc.setSubject('Attestation de déplacement dérogatoire');
    pdfDoc.setKeywords([
      'covid19',
      'covid-19',
      'attestation',
      'déclaration',
      'déplacement',
      'officielle',
      'gouvernement',
    ]);
    pdfDoc.setProducer('https://romainbourre.fr');
    pdfDoc.setCreator('Romain Bourré');
    pdfDoc.setAuthor('Romain Bourré');

    const page1 = pdfDoc.getPages()[0];

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const drawText = (text, x, y, size = 11) => {
      page1.drawText(text, { x, y, size, font });
    };

    drawText(`${user.firstName} ${user.lastName}`, 92, 702);
    drawText(user.birthDate, 92, 684);
    drawText(user.birthPlace, 214, 684);
    drawText(`${user.address} ${user.postalCode} ${user.city}`, 104, 665);

    const caseX = 47;
    const caseFontSize = 12;

    if (reasons.find(r => r.id === 'travail').active) {
      drawText('x', caseX, 553, caseFontSize);
    }
    if (reasons.find(r => r.id === 'achats_culturel_cultuel').active) {
      drawText('x', caseX, 482, caseFontSize);
    }
    if (reasons.find(r => r.id === 'sante').active) {
      drawText('x', caseX, 434, caseFontSize);
    }
    if (reasons.find(r => r.id === 'famille').active) {
      drawText('x', caseX, 410, caseFontSize);
    }
    if (reasons.find(r => r.id === 'handicap').active) {
      drawText('x', caseX, 373, caseFontSize);
    }
    if (reasons.find(r => r.id === 'sport_animaux').active) {
      drawText('x', caseX, 349, caseFontSize);
    }
    if (reasons.find(r => r.id === 'convocation').active) {
      drawText('x', caseX, 276, caseFontSize);
    }
    if (reasons.find(r => r.id === 'missions').active) {
      drawText('x', caseX, 252, caseFontSize);
    }
    if (reasons.find(r => r.id === 'enfants').active) {
      drawText('x', caseX, 228, caseFontSize);
    }

    let locationSize = this.idealFontSize(font, user.city, 83, 7, 11);

    if (!locationSize) {
      alert('Le nom de la ville risque de ne pas être affiché correctement en raison de sa longueur. ' +
        'Essayez d\'utiliser des abréviations ("Saint" en "St." par exemple) quand cela est possible.');
      locationSize = 7;
    }

    drawText(user.city, 78, 76, locationSize);

    drawText(`${datesortie}`, 63, 58, 11);
    drawText(`${releaseHours}:${releaseMinutes}`, 227, 58, 11);

    /**drawText('Date de création:', 464, 150, 7);
    drawText(`${creationDate} à ${creationHour}`, 455, 144, 7);**/

    const qrTitle1 = 'QR-code contenant les informations ';
    const qrTitle2 = 'de votre attestation numérique';

    const generatedQR = await this.generateQR(data);

    const qrImage = await pdfDoc.embedPng(generatedQR);

    page1.drawText(qrTitle1 + '\n' + qrTitle2, { x: 440, y: 130, size: 6, font, lineHeight: 10, color: rgb(1, 1, 1) });

    page1.drawImage(qrImage, {
      x: page1.getWidth() - 156,
      y: 25,
      width: 92,
      height: 92,
    });

    pdfDoc.addPage();
    const page2 = pdfDoc.getPages()[1];
    page2.drawText(qrTitle1 + qrTitle2, { x: 50, y: page2.getHeight() - 70, size: 11, font, color: rgb(1, 1, 1) });
    page2.drawImage(qrImage, {
      x: 50,
      y: page2.getHeight() - 390,
      width: 300,
      height: 300,
    });

    const pdfBytes = await pdfDoc.save();

    return new Blob([pdfBytes], { type: 'application/pdf' });
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
}
