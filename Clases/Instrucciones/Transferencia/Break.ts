import { Nodo } from "../../Ast/Nodo";
import { Ast } from "../../Ast/Ast";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";

export class Detener implements Instruccion{
    public fila: number;
    public columna: number;
    arreglo: boolean;

    constructor(fila, columna) {
        this.fila = fila;
        this.columna = columna;
    }
    
    
    ejecutar(table: TablaSimbolos, tree: Ast) {
        return this;
    }
    
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented BREAK.");
    }

    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre = new Nodo("Break","");
        return padre;
    }

}