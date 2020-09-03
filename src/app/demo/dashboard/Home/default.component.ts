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

  dictionary: Array<string>;

  lowercase: boolean = this.checkboxes[0].checked;
  uppercase: boolean = this.checkboxes[1].checked;
  numbers: boolean = this.checkboxes[2].checked;
  symbols: boolean = this.checkboxes[3].checked;

  passwordLenght = 8;
  buttonLabel = 'Generate';
  newPassword: string;
  @ViewChild('passwordOutput') password: ElementRef;
  private copyPassword() {
    const inputElement = this.password.nativeElement as HTMLInputElement;
    inputElement.select();
    document.execCommand('copy');
  }
  updatePasswordLength(event) {
    this.passwordLenght = event.target.value;
  }
  constructor(private router: Router) { }
  ngOnInit() {
    if (localStorage.getItem('LoggedIn') === 'true') {
      if (localStorage.getItem('isRefreshed') === 'false') {
        localStorage.setItem('isRefreshed', 'true');
        this.refresh();
      }
    } else {
      this.router.navigateByUrl('/auth/signin');
      localStorage.setItem('LoggedIn', 'false');
    }
  }
  refresh(): void {
    window.location.reload();
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
    setTimeout(() => { this.buttonLabel = 'Generate'; } , 1500);
  }
}
