import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-snapclerk-list',
  templateUrl: './snapclerk-list.page.html',
  styleUrls: ['./snapclerk-list.page.scss'],
})
export class SnapclerkListPage implements OnInit {
tabs:string="snapcheck";
  constructor() { }

  receipts=[
    {img:"thumb-01.png",dm:"May 13",year:"2018",title:"Chevron",cate:"Gas"},
    {img:"thumb-02.png",dm:"May 06",year:"2018",title:"Rivers Run",cate:"Gas"},
    {img:"thumb-03.png",dm:"May 04",year:"2018",title:"Flying J",cate:"Gas"},
    {img:"thumb-04.png",dm:"Apr 21",year:"2018",title:"Fred Meyer Fue",cate:"Gas"},
    {img:"thumb-05.png",dm:"Apr 21",year:"2018",title:"Chevron",cate:"Gas"},
    {img:"thumb-06.png",dm:"May 13",year:"2018",title:"Chevron",cate:"Gas"},
    {img:"thumb-01.png",dm:"May 13",year:"2018",title:"Chevron",cate:"Gas"},
    {img:"thumb-02.png",dm:"May 13",year:"2018",title:"Chevron",cate:"Gas"},
    {img:"thumb-03.png",dm:"May 13",year:"2018",title:"Chevron",cate:"Gas"},
  ]

  ngOnInit() {
  }

}
