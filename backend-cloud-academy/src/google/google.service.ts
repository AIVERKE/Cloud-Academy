import { Injectable, Logger } from '@nestjs/common';
import { google, drive_v3, sheets_v4 } from 'googleapis';
import * as fs from 'fs';
import * as stream from 'stream';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);
  
  private auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  private drive: drive_v3.Drive = google.drive({ version: 'v3', auth: this.auth });
  private sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth: this.auth });

  /**
   * Sube un archivo a Google Drive usando un Buffer (más eficiente)
   */
  async uploadFileToDrive(filePath: string, fileName: string, mimeType: string) {
    try {
      const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
      if (!folderId) {
        throw new Error('GOOGLE_DRIVE_FOLDER_ID no está configurado en el .env');
      }

      const fileBuffer = fs.readFileSync(filePath);
      const bufferStream = new stream.PassThrough();
      bufferStream.end(fileBuffer);

      const response = await this.drive.files.create({
        supportsAllDrives: true,
        requestBody: {
          name: fileName,
          parents: [folderId],
        },
        media: {
          mimeType: mimeType,
          body: bufferStream,
        },
        fields: 'id, name',
      });
      
      this.logger.log(`Archivo subido a Drive con ID: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error subiendo archivo a Drive', error);
      throw error;
    }
  }

  /**
   * Lista archivos de la carpeta configurada.
   * Nota: Filtramos en JS para evitar hangs que ocurren en cuentas personales con 'q'.
   */
  async listFiles() {
    try {
      const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
      const response = await this.drive.files.list({
        pageSize: 100,
        fields: 'files(id, name, mimeType, webViewLink, iconLink, parents)',
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });

      const allFiles = response.data.files || [];
      return allFiles.filter(file => 
        folderId && file.parents && file.parents.includes(folderId)
      );
    } catch (error) {
      this.logger.error('Error listando archivos de Drive', error);
      throw error;
    }
  }

  /**
   * Agrega una fila a una hoja de Google Sheets
   */
  async appendRowToSheet(spreadsheetId: string, range: string, values: any[]) {
    try {
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [values],
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error appending row to sheet:', error);
      throw error;
    }
  }

  async getSheetData(spreadsheetId: string, range: string) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
      return response.data.values;
    } catch (error) {
      console.error('Error getting sheet data:', error);
      throw error;
    }
  }
}
