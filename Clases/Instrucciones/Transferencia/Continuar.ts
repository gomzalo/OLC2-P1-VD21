import { Instruccion } from './../../Interfaces/Instruccion';
import { OperadorLogico } from './../../TablaSimbolos/Tipo';
import { Nodo } from "../../Ast/Nodo";
import { Ast } from "../../Ast/Ast"
import { TablaSimbolos } from '../../TablaSimbolos/TablaSimbolos';

export class Continuar implements Instruccion{
    public fila: number;
    public columna: number;

    constructor(fila, columna) {
        this.fila = fila;
        this.columna = columna;
    }
    
    
    ejecutar(table: TablaSimbolos, tree: Ast) {
        return this;
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error('Method not implemented.');
    }
    recorrer(): Nodo {
        let padre = new Nodo("CONTINUE","");
        return padre;
    }

}
