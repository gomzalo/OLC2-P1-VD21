import Ast from "../Ast/Ast";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../TablaSimbolos/Tipo";

export default class Identicador implements Instruccion{
     public id ;
     public fila: number ;
     public columna :  number;
     public tipo : TIPO;

    ejecutar(table: TablaSimbolos, tree: Ast) {
        // let simbolo = table.get
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

}