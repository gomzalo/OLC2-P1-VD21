import { Instruccion } from './../../Interfaces/Instruccion';
import { OperadorLogico } from './../../TablaSimbolos/Tipo';
import { Nodo } from "../../Ast/Nodo";
import { Ast } from "../../Ast/Ast"
import { TablaSimbolos } from '../../TablaSimbolos/TablaSimbolos';
import { Errores } from '../../Ast/Errores';

export class Continuar implements Instruccion{
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
        if(table.continue == null){
            return new Errores('Semantico','No se permite el uso de continue en la instrucción.', this.fila, this.columna);
        }
        genc3d.gen_Goto(table.continue);
    }
    recorrer(): Nodo {
        let padre = new Nodo("CONTINUE","");
        return padre;
    }

}
