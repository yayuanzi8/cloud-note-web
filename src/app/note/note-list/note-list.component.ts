import { Component,
   OnInit,
   Inject,
   Input,
  ChangeDetectorRef,
  OnChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatCheckboxChange, MatSnackBar, MatSnackBarConfig} from '@angular/material';

import { ReplaySubject, Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { NewDirDialogComponent } from '../new-dir-dialog/new-dir-dialog.component';
import { NewNoteDialogComponent } from '../new-note-dialog/new-note-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ChangeLocationDialogComponent } from '../change-location-dialog/change-location-dialog.component';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit, OnChanges {

  @Input() dirId;

  private dirPrefix = 'dir';
  private notePrefix = 'note';
  private headers;
  private base_url = 'http://localhost:8080/note/fileList/';
  private request_url = this.base_url + 'root';

  files = [];
  checkedDir = [];
  checkedNote = [];

  pageStack = [];

  constructor(private route: ActivatedRoute, private router: Router
    , private http: Http, @Inject('auth') private authService, public dialog: MatDialog,
    public snackBar: MatSnackBar) {
      this.authService.getAuth().subscribe(auth => {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Authorization', 'Bearer ' + auth.token);
      });
    }


  private loadDirList() {
      this.http.get(this.request_url, {headers: this.headers})
      .subscribe(res => {
        if (res.json().code === 20000) {
          this.files = res.json().fileSet;
          this.checkedDir = [];
          this.checkedNote = [];
        }
      });
    }

  ngOnInit() {
  }

  ngOnChanges(value) {
    this.request_url = this.base_url + this.dirId;
    this.loadDirList();
  }

  navigateToDir(did: string) {
    this.pageStack.push(this.dirId);
    this.router.navigate(['note/' + this.dirPrefix + did]);
  }

  navigateToNote(nid: string) {
    this.pageStack.push(this.dirId);
    this.router.navigate(['note/' + this.notePrefix + nid]);
  }

  openNewDirDialog(): void {
    const dialogRef = this.dialog.open(NewDirDialogComponent, {
      data: {parent: this.dirId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.files.push(result.data);
      }
    });
  }

  openNewNoteDialog(): void {
    const dialogRef = this.dialog.open(NewNoteDialogComponent, {
      data: {parent: this.dirId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.files.push(result.data);
      }
    });
  }

  toggleCheck($event, file): void {
    const checked = $event.checked;
    if (checked && file.type === 'directory') {
      this.checkedDir.push(file);
    } else if (checked && file.type === 'note') {
      this.checkedNote.push(file);
    } else if (!checked && file.type === 'directory') {
      const checkedIndex = this.checkedDir.indexOf(file);
      this.checkedDir = [...this.checkedDir.slice(0, checkedIndex), ...this.checkedDir.slice(checkedIndex + 1)];
    } else {
      const checkedIndex = this.checkedNote.indexOf(file);
      this.checkedNote = [...this.checkedNote.slice(0, checkedIndex), ...this.checkedNote.slice(checkedIndex + 1)];
    }
  }

  private showHint(msg): void {
    this.snackBar.open(msg, '关闭', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  private checkPathValid(pageStack, msg): boolean {
    let fail = false;
    this.checkedDir.forEach((dir, index) => {
      const index2 = pageStack.indexOf(dir.did);
      if (index2 !== -1) {
        fail = true;
      }
    });
    if (fail) {
      this.showHint(msg);
      return fail;
    }
  }

  refreshFiles(): void {
    this.loadDirList();
  }

  prevPage(): void {
    this.router.navigate(['note/' + this.dirPrefix + this.pageStack.pop()]);
  }

  moveDirAndNote(): void {
    const dialogRef = this.dialog.open(ChangeLocationDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result.confirm) {
        const pageStack = result.pageStack;
        if (this.checkPathValid(pageStack, '不能将目录移动到当前目录或子目录')) {
          return;
        }
        const checkedDirIds = [];
        this.checkedDir.forEach(dir => {
          checkedDirIds.push(dir.did);
        });
        const checkedNoteIds = [];
        this.checkedNote.forEach(note => {
          checkedNoteIds.push(note.nid);
        });
        this.http.patch('http://localhost:8080/note/move', JSON.stringify({
          dirs: checkedDirIds,
          notes: checkedNoteIds,
          dest: pageStack.pop(),
        }), {headers: this.headers})
        .subscribe(res => {
          if (res.json().code === 20000) {
            this.deleteCheckedFiles();
            this.showHint('移动成功');
          }else {
            this.showHint(res.json().msg);
          }
        });
      }
    });
  }

  copyDirAndNote(): void {
    const dialogRef = this.dialog.open(ChangeLocationDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result.confirm === true) {
        const pageStack = result.pageStack;
        if (this.checkPathValid(pageStack, '不能将目录复制到当前目录或子目录')) {
          return;
        }
        const dest = pageStack.pop();
        const checkedDirIds = [];
        this.checkedDir.forEach(dir => {
          checkedDirIds.push(dir.did);
        });
        const checkedNoteIds = [];
        this.checkedNote.forEach(note => {
          checkedNoteIds.push(note.nid);
        });
        this.http.patch('http://localhost:8080/note/copy', JSON.stringify({
          dirs: checkedDirIds,
          notes: checkedNoteIds,
          dest: dest
        }), {headers: this.headers}).subscribe(res => {
          if (res.json().code === 20000) {
            this.checkedDir = [];
            this.checkedNote = [];
            this.showHint('复制成功');
          }else {
            this.showHint(res.json().msg);
          }
        });
      }
    });
  }

  share(): void {
    const nid = this.checkedNote[0].nid;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {msg: '确定分享[' + this.checkedNote[0].title + ']?'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.confirm) {
        this.http.post('http://localhost:8080/note/share', JSON.stringify({nid: nid}), {headers: this.headers}).subscribe(res => {
          if (res.json().code === 20000) {
            this.showHint('成功分享[' + this.checkedNote[0].title + ']');
            this.checkedNote = [];
          }else {
            this.showHint(res.json().msg);
          }
        });
      }
    });
  }

  private moveCheckedToTrash(): void {
    const checkedDirIds = [];
    this.checkedDir.forEach(value => {
      checkedDirIds.push(value.did);
    });
    const checkedNoteIds = [];
    this.checkedNote.forEach(value => {
      checkedNoteIds.push(value.nid);
    });
    const request_data = {
      dirs: checkedDirIds,
      notes: checkedNoteIds
    };
    this.http.post('http://localhost:8080/note/toRubbish', JSON.stringify(request_data), {headers: this.headers}).subscribe(res => {
      console.dir(res);
      if (res.json().code === 20000) {
        this.deleteCheckedFiles();
      }
    });
  }


  moveDirAndNoteToTrash(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {msg: '确定将所选笔记/文件夹移入回收站?'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.confirm) {
        this.moveCheckedToTrash();
      }
    });
  }

  private deleteCheckedFiles(): void {
    this.checkedDir.forEach(dir => {
      const index = this.files.indexOf(dir);
      this.files = [...this.files.slice(0, index), ...this.files.slice(index + 1)];
    });
    this.checkedNote.forEach(note => {
      const index = this.files.indexOf(note);
      this.files = [...this.files.slice(0, index), ...this.files.slice(index + 1)];
    });
    this.checkedDir = [];
    this.checkedNote = [];
  }

  private deleteChecked(): void {
    const checkedDirIds = [];
    this.checkedDir.forEach(value => {
      checkedDirIds.push(value.did);
    });
    const checkedNoteIds = [];
    this.checkedNote.forEach(value => {
      checkedNoteIds.push(value.nid);
    });
    const request_data = {
      dirs: checkedDirIds,
      notes: checkedNoteIds
    };
    this.http.post('http://localhost:8080/note/delete',
    JSON.stringify(request_data), {headers: this.headers})
    .subscribe(res => {
      if (res.json().code === 20000) {
        this.deleteCheckedFiles();
      }
    });
  }

  deleteDirAndNote(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {msg: '确定彻底删除所选笔记/文件夹?'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.confirm) {
        this.deleteChecked();
      }
    });
  }

}
