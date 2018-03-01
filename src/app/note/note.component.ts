import { Component, OnInit, Inject} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ReplaySubject, Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  private dirPrefix = 'dir';
  private notePrefix = 'note';
  currentDirId = 'root';

  noteId = null;
  dest;

  dirFlag = false;
  noteFlag = false;
  change = false;

  functions = [
    {link: '/note/root', icon: 'folder', name: '我的文件'},
    {link: '/myshare', icon: 'share', name: '我的分享'},
    {link: '/rubbish', icon: 'delete_sweep', name: '回收站'}
  ];

  constructor(private route: ActivatedRoute, private router: Router) { }

  private allFalse() {
    this.dirFlag = false;
    this.noteFlag = false;
  }

  private changeToDirView(dir) {
    this.allFalse();
    this.dirFlag = true;
    this.currentDirId = dir;
    this.change = true;
  }

  private changeToNoteView(note ) {
    this.allFalse();
    this.noteFlag = true;
    this.noteId = note;
  }

  private changeToRootView() {
    this.changeToDirView('root');
  }

  private navigateToRootView (){
    this.router.navigate(['note/root']);
  }

  private toSpecifyView() {
    if (this.dest.startsWith(this.dirPrefix)) {
      const dir = this.dest.substring(this.dirPrefix.length);
      this.changeToDirView(dir);
    }else if (this.dest.startsWith(this.notePrefix)) {
      const note = this.dest.substring(this.notePrefix.length);
      this.changeToNoteView(note);
    }else if (this.dest === 'root') {
      this.changeToRootView();
    }else {
      this.navigateToRootView();
    }
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      const dest = params['dest'];
      this.dest = dest;
      this.toSpecifyView();
    });
  }

}
