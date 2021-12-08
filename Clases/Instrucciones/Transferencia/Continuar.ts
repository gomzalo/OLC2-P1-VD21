import { Instruccion } from './../../Interfaces/Instruccion';
import { OperadorLogico } from './../../TablaSimbolos/Tipo';
import { Nodo } from "../../Ast/Nodo";
import { Ast } from "../../Ast/Ast"
import { TablaSimbolos } from '../../TablaSimbolos/TablaSimbolos';

export class Continuar implements Instruccion{

    constructor(){

    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error('Method not implemented.');
    }
    ejecutar(table: TablaSimbolos, tree: Ast) {
        return this;
    }
    recorrer(): Nodo {
        let padre = new Nodo("CONTINUE","");
        return padre;
    }

}
