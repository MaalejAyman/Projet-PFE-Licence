import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.scss']
})
export class WebsiteComponent implements OnInit {
  WForm = new FormGroup({
    Name: new FormControl("", [Validators.required]),
    Website: new FormControl("", [Validators.required]),
  });
  constructor() { }

  ngOnInit(): void {
  }

}
