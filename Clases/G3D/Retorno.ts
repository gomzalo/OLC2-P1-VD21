import { TIPO } from './../TablaSimbolos/Tipo';
import { GeneradorC3D } from "./GeneradorC3D";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { Simbolo } from '../TablaSimbolos/Simbolo';

export class Retorno {
    valor: string;
    istemp: boolean;
    tipo: TIPO;
    lblTrue: string;
    lblFalse: string;
    public simbolo : Simbolo;

    constructor(valor:string, istemp:boolean, tipo:TIPO, simbolo: Simbolo  = null){
        this.valor = valor;
        this.istemp = istemp;
        this.tipo = tipo;
        this.lblTrue = this.lblFalse = '';
        this.simbolo = simbolo;
    }

    public translate3d() {
        return this.valor;
    }
}