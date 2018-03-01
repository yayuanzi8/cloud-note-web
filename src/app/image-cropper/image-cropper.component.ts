import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as Cropper from 'cropperjs';

export interface CropResult {
  hasCrop: boolean;
  blob?: Blob;
}

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class MyImageCropperComponent implements OnInit, OnDestroy {

  @ViewChild('img') private img: ElementRef;
  @ViewChild('imageInputFile') private imageInputFile: ElementRef;

  private cropper: Cropper;

  private cropResult: CropResult = {
    hasCrop: false,
    blob: null
  };

  @Input() imgSrc = 'http://h1.ioliu.cn//bing/StormySeas_EN-AU9331975024_1920x1080.jpg';


  @Output() imgChange = new EventEmitter<CropResult>();

  constructor() {}

  private emitCropResult() {
    const canvasElem = this.cropper.getCroppedCanvas({
      width: 100,
      height: 100
    });
    canvasElem.toBlob((blob: Blob) => {
      this.cropResult = {
        hasCrop: true,
        blob: blob
      };
      this.imgChange.emit(this.cropResult);
    }, 'image/jpeg');
  }

  ngOnInit() {
    const image = this.img.nativeElement as HTMLImageElement;
    this.cropResult = {
      hasCrop: false,
      blob: null
    };
    this.imgChange.emit(this.cropResult);
    const self = this;
    const options = {
      aspectRatio: 1 / 1,
      viewMode: 1,
      dragMode: 'move',
      movable: true,
      // 拖动完毕之后再传给父组件
      cropend: function(e) {
        self.emitCropResult();
      },
      zoom: function(e) {
        self.emitCropResult();
      }
    };
    this.cropper = new Cropper(image, options);
  }

  delegateToFileInput() {
    this.imageInputFile.nativeElement.click();
  }

  imageChange($event) {
    const file = $event.target.files[0];
    const URL = window.URL || (window as any).webkitURL;
    const obj = URL.createObjectURL(file);
    this.cropper.replace(obj);
    this.cropResult = {
      hasCrop: true,
      blob: file
    };
    this.imgChange.emit(this.cropResult);
  }

  ngOnDestroy(): void {
    this.cropper.destroy();
  }

}
