import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UploadResult } from '../models/upload.model';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/upload`;

  /**
   * Upload a single image as multipart/form-data.
   * We deliberately do NOT set a Content-Type header — HttpClient lets the
   * browser add the correct multipart boundary when the body is FormData.
   */
  uploadImage(file: File): Observable<UploadResult> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<UploadResult>(`${this.baseUrl}/image`, form);
  }
}
