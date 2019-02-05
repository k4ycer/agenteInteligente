import { MapaDefault } from './data/MapaDefault';
import { Agente } from './model/Agente';
import { Mundo } from './model/Mundo';
import { Component } from '@angular/core';
import { ElementoMundo } from './model/ElementoMundo';
import { Coordenada } from './model/Coordenada';
import { TipoElemento } from './model/TipoElemento';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'AgenteInteligente';

	public mundo: Mundo;
	public agente: Agente;
	public delaySimulacionUI: number = 500;
	public limitePasos: number = 1000;
	public metricaPasosUI: number = 0;
	public posicionesRecorridasUI: ElementoMundo[] = [];

	ngOnInit(){
		this.crearMundo();	
		this.crearAgente();		
	}
	
	ngAfterViewInit(){
		this.dibujarAgente(this.agente.posicionActual);
		// this.iniciarBusqueda();
	}

	crearMundo(){
		this.mundo = new Mundo(MapaDefault.length, MapaDefault[0].length, MapaDefault);		
		console.log('mundo', this.mundo);
	}

	crearAgente(){
		this.agente = new Agente(this.mundo, this.mundo.mapa[7][4]);		
		// this.agente = new Agente(this.mundo, this.mundo.mapa[9][2]);
		
		this.agente.observablePosiciones.subscribe(historialPosiciones => {
			if(historialPosiciones.length == 0){
				return;
			}

			let posicion = historialPosiciones[historialPosiciones.length - 1];
			((posicion, i)=> {
				setTimeout(() => {
					this.dibujarAgente(posicion);
					this.metricaPasosUI++;
					this.posicionesRecorridasUI.push(posicion);
				}, this.delaySimulacionUI * i);
			})(posicion, historialPosiciones.length - 1);
		});
	}

	iniciarBusqueda(){		
		if(!this.agente.encontrarElementoTipo(TipoElemento.Salida, this.limitePasos)){
			alert("No se encontro el elemento despues de " + this.limitePasos + " pasos");
		}
	}

	dibujarAgente(posicion: ElementoMundo){
		let idElementoPosicionActual: string = "elemento_" + posicion.id;
		let elementoActualUI = document.getElementById(idElementoPosicionActual);
		let agenteUI = document.getElementById("agente");
		agenteUI.style.left = (elementoActualUI.offsetLeft + 10) + "px";
		agenteUI.style.top = (elementoActualUI.offsetTop + 10) + "px";
	}
}


