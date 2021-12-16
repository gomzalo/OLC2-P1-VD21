import { TIPO } from './../TablaSimbolos/Tipo';
import { GeneradorC3D } from "./GeneradorC3D";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";

export class Retorno {
    valor: string;
    istemp: boolean;
    tipo: TIPO;
    lblTrue: string;
    lblFalse: string;

    constructor(valor:string, istemp:boolean, tipo:TIPO){
        this.valor = valor;
        this.istemp = istemp;
        this.tipo = tipo;
        this.lblTrue = this.lblFalse = '';
    }

    public translate3d() {
        return this.valor;
    }
}