import { TipoElemento } from './TipoElemento';
import { Percepcion } from './Percepcion';
import { Sensor } from './Sensor';
import { ElementoMundo } from './ElementoMundo';
import { Mundo } from './Mundo';
import { BehaviorSubject } from 'rxjs';

export class Agente{
    public sensor: Sensor;
    public mundo: Mundo;
    public posicionActual: ElementoMundo;
    public historialPosiciones: ElementoMundo[];
    public observablePosiciones: BehaviorSubject<ElementoMundo[]>;

    constructor(mundo: Mundo, posicionActual: ElementoMundo, sensor?: Sensor){
        this.mundo = mundo;
        this.posicionActual = posicionActual;
        this.sensor = sensor ? sensor : new Sensor();
        this.historialPosiciones = [];
        this.observablePosiciones = new BehaviorSubject<ElementoMundo[]>(this.historialPosiciones);
    }

    public agregarSensor(sensor: Sensor){
        this.sensor = sensor;
    }

    public sensar(): Percepcion{
        return this.sensor.sensar(this.mundo, this.posicionActual);
    }

    public cambiarPosicion(elementoMundo: ElementoMundo){
        this.posicionActual = elementoMundo;
        this.historialPosiciones.push(elementoMundo);
        this.observablePosiciones.next(this.historialPosiciones);
    }
    
    public calcularSiguientePosicion(percepcion: Percepcion): ElementoMundo{
        let x1: boolean, x2: boolean, x3: boolean, x4: boolean;
        let s1: number, s2: number, s3: number, s4: number, s5: number, s6: number, s7: number, s8: number;
        let representacionEnteraPercepcion;

        s1 = parseInt("10000000", 2);
        s2 = parseInt("01000000", 2);
        s3 = parseInt("00100000", 2);
        s4 = parseInt("00010000", 2);
        s5 = parseInt("00001000", 2);
        s6 = parseInt("00000100", 2);
        s7 = parseInt("00000010", 2);
        s8 = parseInt("00000001", 2);
        representacionEnteraPercepcion = percepcion.getRepresentacionEntera();

        x1 = ((representacionEnteraPercepcion & s2) == s2) || ((representacionEnteraPercepcion & s3) == s3);
        x2 = ((representacionEnteraPercepcion & s4) == s4) || ((representacionEnteraPercepcion & s5) == s5);
        x3 = ((representacionEnteraPercepcion & s6) == s6) || ((representacionEnteraPercepcion & s7) == s7);
        x4 = ((representacionEnteraPercepcion & s1) == s1) || ((representacionEnteraPercepcion & s8) == s8);

        if((!x1 && !x2 && !x3 && !x4) || (!x1 && x4)){
            return this.mundo.obtenerElementoNorte(this.posicionActual);
        }else if(x3 && !x4){
            return this.mundo.obtenerElementoOeste(this.posicionActual);
        }else if(x2 && !x3){
            return this.mundo.obtenerElementoSur(this.posicionActual);
        }else if(x1 && !x2){
            return this.mundo.obtenerElementoEste(this.posicionActual);
        }
    }

    public encontrarElementoTipo(tipoElemento: TipoElemento, delay?: number): ElementoMundo{
        let percepcion: Percepcion,
            siguientePosicion: ElementoMundo;

        while(this.posicionActual.tipoElemento != tipoElemento){
            percepcion = this.sensar();
            siguientePosicion = this.calcularSiguientePosicion(percepcion);
            this.cambiarPosicion(siguientePosicion);
        }

        return this.posicionActual;
    }
}