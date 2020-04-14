import { Injectable } from '@angular/core';
import {User} from '../models/user.model';
import {PDFDocument, StandardFonts} from 'pdf-lib';
import QRCode from 'qrcode';
import {HttpClient} from '@angular/common/http';
import {Reason} from '../pages/attestation-page/attestation-page.component';
import {DateFormatPipe} from '../pipes/date-format.pipe';

@Injectable({
  providedIn: 'root'
})
export class AttestationService {

  constructor(private http: HttpClient,
              private datePipe: DateFormatPipe) { }

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

    const data = [
      `Cree le: ${creationDate} a ${creationHour}`,
      `Nom: ${user.lastName}`,
      `Prenom: ${user.firstName}`,
      `Naissance: ${user.birthDate} a ${user.birthPlace}`,
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
    drawText(user.birthDate, 123, 661);
    drawText(user.birthPlace, 92, 638);
    drawText(`${user.address} ${user.postalCode} ${user.city}`, 134, 613);

    if (reasons[0].active) {
      drawText('x', 76, 527, 19);
    }
    if (reasons[1].active) {
      drawText('x', 76, 478, 19);
    }
    if (reasons[2].active) {
      drawText('x', 76, 436, 19);
    }
    if (reasons[3].active) {
      drawText('x', 76, 400, 19);
    }
    if (reasons[4].active) {
      drawText('x', 76, 345, 19);
    }
    if (reasons[5].active) {
      drawText('x', 76, 298, 19);
    }
    if (reasons[6].active) {
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
