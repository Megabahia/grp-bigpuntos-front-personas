import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-que-es',
  templateUrl: './que-es.component.html',
  styleUrls: ['./que-es.component.scss']
})
export class QueEsComponent implements OnInit {
  public videos:Array<any>;

  constructor() { }

  ngOnInit(): void {
  }

}
