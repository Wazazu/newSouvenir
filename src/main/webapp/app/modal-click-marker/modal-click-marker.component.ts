import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'modal-click-marker',
  templateUrl: './modal-click-marker.component.html',
  styles: []
})
export class ModalClickMarkerComponent implements OnInit {
  @Input()titre:string;
  @Input()description:string;

  constructor(public activeModal: NgbActiveModal) { }
  ngOnInit() {
    console.log("titre " + this.titre);
    console.log("description " + this.description);
  }
}
