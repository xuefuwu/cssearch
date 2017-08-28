import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { QueryService } from "./queryService";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  items = [];
  pageindex=1;
  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private queryService: QueryService
  ) {

  }
  searchForm = this.formBuilder.group({
    'name': [],
    'no': []
  });

  getItems(search, ev) {
    this.pageindex=1;
    var name = search.name;
    var no = search.no;
    this.queryService.querycsxx(name, no, this.pageindex).subscribe(data => {
      data.data.rows.forEach(e =>{
        this.items.push({
          name: e["场所名称"],
          jb: e["教别"],
          fzr: e["负责人姓名"],
          txdz: e["通信地址"]
        })
      });
    });
  }
  doInfinite(search,infiniteScroll) {
    this.pageindex++;
    var name = search.name;
    var no = search.no;
    this.queryService.querycsxx(name, no, this.pageindex).subscribe(data => {
      data.data.rows.forEach(e => {
        this.items.push({
          name: e["场所名称"],
          jb: e["教别"],
          fzr: e["负责人姓名"],
          txdz: e["通信地址"]
        })
      });
    });
    infiniteScroll.complete();
  }
}
