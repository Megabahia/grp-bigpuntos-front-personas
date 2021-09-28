import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-que-es',
  templateUrl: './que-es.component.html',
  styleUrls: ['./que-es.component.scss']
})
export class QueEsComponent implements OnInit {
  public videos: Array<any> =
    [
      {
        nombre:"",
        config: {
          duracion: "12:30" ,
          url:"https://www.youtube.com/embed/bTqVqk7FSmY"
        }
      }
    ];

  constructor() { }

  ngOnInit(): void {
  }

}
