import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  AfterViewInit,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef } from '@angular/core';
import {FileUploader} from 'ng2-file-upload';

import { ReplaySubject, Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Http, Headers, Response } from '@angular/http';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.css']
})
export class NoteEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('ocrImage', {read: ElementRef}) ocr_image_component: ElementRef;

  @Input() elementId: string;
  @Input() noteId: string;

  uploader: FileUploader = new FileUploader({
    url: 'http://localhost:8080/tps/ocr',
    method: 'POST',
    itemAlias: 'imageFile'
  });


  options: FormGroup;
  title = '';
  note = {nid: '', title: '', content: ''};
  titleInfo = new FormControl('', [Validators.required]);
  editor;
  processingSave = false;

  private headers;

  constructor(fb: FormBuilder, private http: Http, @Inject('auth') private authService) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'never',
    });
    this.authService.getAuth().subscribe(auth => {
      this.headers = new Headers();
      this.headers.append('Authorization', 'Bearer ' + auth.token);
      this.headers.append('Content-Type', 'application/json');
    });
  }

  private loadNoteData(): void {
    this.http.get('http://localhost:8080/note/usernote/' + this.noteId, {headers: this.headers})
    .subscribe(res => {
      if (res.json().code === 20000) {
        this.note = res.json().note;
        this.editor.setContent(this.note.content);
        this.title = this.note.title;
      }
    });
  }

  ngOnInit() {
    this.loadNoteData();
  }

  getTitleErrorMessage(): string {
    if (this.titleInfo.hasError('required')) {
      return '标题必须填写';
    }
    return '';
  }

  saveNote(): void {
    this.processingSave = true;
    this.note.content = this.editor.getContent();
    const request = {
      nid: this.note.nid,
      title: this.note.title,
      content: this.note.content
    };
    this.http.post('http://localhost:8080/note/update', JSON.stringify(request), {headers: this.headers})
    .subscribe(res => {
      if (res.json().code === 20000) {
        this.note = res.json().note;
      }
    });
    this.processingSave = false;
  }

  uploadOCRImage(): void {
    this.ocr_image_component.nativeElement.click();
  }

  selectedFileOnChanged($event): void {
    this.uploader.queue[0].onSuccess = (response, status, headers) => {
      // 上传文件成功
      const res = JSON.parse(response);
      if (status === 200 && res.code === 20000) {
          // 上传文件后获取服务器返回的数据
          const content = res.content;
          const oldContent = this.note.content;
          this.editor.setContent(oldContent + content);
      }else {
          // 上传文件后获取服务器返回的数据错误
      }
    };
    this.uploader.queue[0].upload(); // 开始上传
    this.uploader.onCompleteAll = () => {
      this.uploader.clearQueue();
    };
  }

  ngAfterViewInit() {
    const self = this;
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['link', 'paste', 'table', 'image', 'textcolor', 'lists',
               'fullscreen', 'wordcount', 'emoticons', 'help', 'colorpicker',
               'advlist', 'searchreplace' ],
      skin_url: '/assets/skins/lightgray',
      language: 'zh_CN',
      height: 448,
      setup: editor => {
        this.editor = editor;
        editor.on('keyup', () => {
          const content = editor.getContent();
        });
      },
      images_upload_handler: function(blobInfo, success, failure){
        console.log(blobInfo.blob());
        console.log(blobInfo.filename());
        const formData = new FormData();
        const multiPartHeaders = new Headers();
        multiPartHeaders.append('Accept', 'application/json');
        multiPartHeaders.append('Authorization', self.headers.get('Authorization'));
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        self.http.post('http://localhost:8080/tps/upload', formData , {headers: multiPartHeaders}).subscribe(res => {
          if (res.json().code === 20000) {
            success(res.json().url);
          }else {
            failure('上传出错!');
          }
        });
      }
    });
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

}
