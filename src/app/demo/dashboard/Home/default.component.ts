import { NotesService } from './../../../Services/notes.service';
import { Notes } from './../../../Models/notes.model';
import { Component, OnInit, ViewChild, ElementRef, VERSION } from '@angular/core';
import '../../../../assets/charts/amchart/amcharts.js';
import '../../../../assets/charts/amchart/gauge.js';
import '../../../../assets/charts/amchart/serial.js';
import '../../../../assets/charts/amchart/light.js';
import '../../../../assets/charts/amchart/pie.min.js';
import '../../../../assets/charts/amchart/ammap.min.js';
import '../../../../assets/charts/amchart/usaLow.js';
import '../../../../assets/charts/amchart/radar.js';
import '../../../../assets/charts/amchart/worldLow.js';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DeleteDialogComponent } from 'src/app/theme/shared/Modals/delete-dialog/delete-dialog.component';
import { Websites } from 'src/app/Models/WebSites.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  checkboxes = [
    {
      id: 'lowercase',
      label: 'a-z',
      library: 'abcdefghijklmnopqrstuvwxyz',
      checked: false
    }, {
      id: 'uppercase',
      label: 'A-Z',
      library: 'ABCDEFGHIJKLMNOPWRSTUVWXYZ',
      checked: false
    }, {
      id: 'numbers',
      label: '0-9',
      library: '0123456789',
      checked: false
    }, {
      id: 'symbols',
      label: '!-?',
      library: '!@#$%^&*-_=+\\|:;\',.\<>/?~',
      checked: false
    }
  ];
  version: string = `Angular v${VERSION.full}`;
  NotesUser: Notes[];
  dictionary: Array<string>;
  Note: Notes;
  lowercase: boolean = this.checkboxes[0].checked;
  uppercase: boolean = this.checkboxes[1].checked;
  numbers: boolean = this.checkboxes[2].checked;
  symbols: boolean = this.checkboxes[3].checked;
  NForm = new FormGroup({
    Text: new FormControl('', [Validators.required]),
  });
  passwordLenght = 8;
  buttonLabel = 'Generate';
  newPassword: string;
  @ViewChild('passwordOutput') password: ElementRef;
  constructor(private router: Router, private Nservice: NotesService, private dialog: MatDialog) { }
  ngOnInit() {
    if (localStorage.getItem('LoggedIn') === 'true') {
      if (localStorage.getItem('isRefreshed') === 'false') {
        localStorage.setItem('isRefreshed', 'true');
        this.refresh();
      }
      localStorage.setItem('NotesId', null);
      this.GetNotesByUser();
    } else {
      this.router.navigateByUrl('/auth/signin');
      localStorage.setItem('LoggedIn', 'false');
    }
  }
  refresh(): void {
    window.location.reload();
  }
  private copyPassword() {
    const inputElement = this.password.nativeElement as HTMLInputElement;
    inputElement.select();
    document.execCommand('copy');
  }
  updatePasswordLength(event) {
    this.passwordLenght = event.target.value;
  }
  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
  updateCheckboxValue(event) {
    if (event.target.id === 'lowercase') {
      this.lowercase = event.target.checked;
    }
    if (event.target.id === 'uppercase') {
      this.uppercase = event.target.checked;
    }

    if (event.target.id === 'numbers') {
      this.numbers = event.target.checked;
    }

    if (event.target.id === 'symbols') {
      this.symbols = event.target.checked;
    }
  }
  generatePassword() {
    if (this.lowercase === false && this.uppercase === false && this.numbers === false && this.symbols === false) {
      return this.newPassword = '...';
    }
    this.dictionary = [].concat(
      this.lowercase ? this.checkboxes[0].library.split('') : [],
      this.uppercase ? this.checkboxes[1].library.split('') : [],
      this.numbers ? this.checkboxes[2].library.split('') : [],
      this.symbols ? this.checkboxes[3].library.split('') : []
    );
    let newPassword = '';
    for (let i = 0; i < this.passwordLenght; i++) {
      newPassword += this.dictionary[Math.floor(Math.random() * this.dictionary.length)];
    }
    this.newPassword = newPassword;
    this.copyPassword();
    this.buttonLabel = 'Copied!';
    setTimeout(() => { this.buttonLabel = 'Generate'; }, 1500);
  }
  insertNotes() {
    if (this.NForm.valid) {
      this.GetNote();
      this.Nservice
        .InsertNotes(this.Note)
        .toPromise()
        .then((res) => {
          this.NotesUser = [];
          this.GetNotesByUser();
        });
    } else {
      let dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {
          Text:
            'Please check that all the fields are filled !!',
        },
      });
    }
  }
  updateNotes() {
    if (this.NForm.valid && localStorage.getItem('NotesId') !== 'null') {
      this.GetUpdateNote();
      this.Nservice
        .UpdateNotes(this.Note)
        .toPromise()
        .then((res) => {
          this.NotesUser = [];
          this.GetNotesByUser();
        });
    } else {
      let dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {
          Text:
            'Please select a Note !!',
        },
      });
    }
  }
  GetNotesByUser() {
    this.Nservice
      .GetNotesByUser()
      .toPromise()
      .then((res) => {
        if (res != null) {
          this.NotesUser = res;
        }
      });
  }
  FillFields(N: Notes) {
    this.NForm.setValue({
      Text: N.Text,
    });
    localStorage.setItem('NotesId', N.Id.toString());
  }
  GetNote() {
    this.Note = new Notes();
    this.Note.Text = this.NForm.value.Text;
  }
  GetUpdateNote() {
    this.Note = new Notes();
    this.Note.Id = parseInt(localStorage.getItem('NotesId'));
    this.Note.Text = this.NForm.value.Text;
  }
  emptyFields() {
    this.NForm.setValue({
      Text: '',
    });
    localStorage.setItem('NotesId', null);
  }
  DeleteNotes() {
    if (localStorage.getItem('NotesId') != null) {
      let dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {
          Text:
            'Do you realy want to delete the this Note ?',
        },
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.GetUpdateNote();
          this.Nservice
            .DropNotes(this.Note)
            .toPromise()
            .then((res) => {
                this.NotesUser = [];
                this.GetNotesByUser();
            });
          this.emptyFields();
        }
      });
    }
  }
}
