import { Instruccion } from '../Interfaces/Instruccion';
import { Funcion } from './../Instrucciones/Metodos/Funcion';
import { TIPO } from './Tipo';

export class Simbolo_funcion{
    tipo: TIPO;
    id: string;
    size: number;
    parameters: Array<Instruccion>;

    constructor(func: Funcion){
        this.tipo = func.tipo;
        this.id = func.id;
        this.size = func.parameters.length;
        this.parameters = func.parameters;
    }
}