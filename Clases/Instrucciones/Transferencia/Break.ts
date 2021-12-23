import { Errores } from './../../Ast/Errores';
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
        const genc3d = tree.generadorC3d;
        if(table.break == null){
            return new Errores('Semantico','No se permite el uso de break en la instrucción.', this.fila, this.columna);
        }
        genc3d.gen_Goto(table.break);
    }

    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre = new Nodo("Break","");
        return padre;
    }

}