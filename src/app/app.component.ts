import { Component, Inject } from '@angular/core';
import * as Tesseract from 'tesseract.js';
//import { MediaStreamTrack } from '@angular/common/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  private ocrResult: string = '';
  private video: HTMLVideoElement;
  private stream: MediaStream;
  private track: MediaStreamTrack;
  
  constructor(@Inject(DOCUMENT) private document: Document) {}


  ngAfterViewInit() {
    // Initialize Tesseract with language and worker
    // Tesseract.initialize('eng', { worker: new Tesseract.Worker() });

    // Access the browser camera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.stream = stream;
        this.video = this.document.getElementById('video') as HTMLVideoElement;
        this.video.srcObject = stream;
        this.video.play();
        // Capture image on button click
        const captureButton = this.document.getElementById('captureButton');
        captureButton?.addEventListener('click', () => this.captureAndOCR());
      })
      .catch(error => {
        console.error('Camera access error:', error);
      });
  }
  ngOnDestroy() {
    // Stop video stream and track
    this.stream.getTracks().forEach(track => track.stop());
  }
  captureAndOCR() {
    const canvas = this.document.createElement('canvas');
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(this.video, 0, 0);
    const imageData = canvas.toDataURL();
    Tesseract.recognize(imageData)
      .then((ocrResult:any) => {
        this.ocrResult = ocrResult.data.text;
        this.document.getElementById('ocr-result')!.textContent = this.ocrResult;
      })
      .catch((error:any) => {
        console.error('OCR error:', error);
      });
  }
}
