// import { Expresion } from "../Interfaces/Expresion";
import {Ast} from "../Ast/Ast";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../TablaSimbolos/Tipo";
import  Nodo  from "../Ast/Nodo";
export class Primitivo implements Instruccion{
    public tipo : TIPO;
    public valor: any;
    public fila : number;
    public columna : number;

    constructor(valor, tipo, fila, columna ){
        this.valor =  valor;
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        return this.valor;
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast): Nodo {
        let padre = new Nodo("PRIMITIVO","");
        padre.addChildNode(new Nodo(this.valor.toString(),""));
        return padre;
    }

}