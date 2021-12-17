import { Nodo } from "../../Ast/Nodo";
import { Ast } from "../../Ast/Ast"
// import { Expresion } from "../../Interfaces/Expresion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { OperadorLogico, TIPO } from "../../TablaSimbolos/Tipo";
import { Errores } from '../../Ast/Errores';
import { Instruccion } from "../../Interfaces/Instruccion";
import { setFlagsFromString } from "v8";

export class Arreglo implements Instruccion{
    public tipo: TIPO;
    public valor;
    fila: number;
    columna: number;
    arreglo: boolean;
    
    public constructor(tipo, valor, fila, columna) {
        this.tipo = tipo;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        return this.valor;
    }

    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented ARR.");
    }

    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre =  new Nodo("Arreglo","");
        padre.addChildNode(new Nodo(this.valor.join(),""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }
}