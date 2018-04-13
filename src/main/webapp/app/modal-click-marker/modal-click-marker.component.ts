import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'modal-click-marker',
  templateUrl: './modal-click-marker.component.html',
  styles: []
})
export class ModalClickMarkerComponent implements OnInit {

  titre:string;
  description:string;
  idMemory:number;

  constructor(public activeModal: NgbActiveModal, private router: Router) { }
  ngOnInit() {
    console.log(this.idMemory);
  }
  consulterSouvenir(){
    this.activeModal.close();
    this.router.navigate(['/memory', this.idMemory ]);
  }
}
