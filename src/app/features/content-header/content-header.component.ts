import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.scss']
})
export class ContentHeaderComponent implements OnInit {
@Input() title : string;
  constructor() { }

  ngOnInit(): void {
  }

}
