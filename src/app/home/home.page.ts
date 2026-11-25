import { Component, OnInit } from '@angular/core';
import { MesasRepository } from '../core/data-access/mesas.repository';
import { Mesa } from '../shared/models/mesa.model';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements OnInit {
  mesas: Mesa[] = [];

  // Inyectamos el Repositorio
  constructor(private mesasRepo: MesasRepository) {}

  async ngOnInit() {
    try {
      this.mesas = await this.mesasRepo.getMesas();
      console.log('Datos obtenidos desde el Repositorio:', this.mesas);
    } catch (error) {
      console.error('Error:', error);
    }
  }
}