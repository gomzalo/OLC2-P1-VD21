import { Ast } from "../../Ast/Ast";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";

export class Funcion implements Instruccion{
    public fila: number;
    public columna: number;
    public id : string;
    public parameters ;
    public instructions : Array<Instruccion>;

    constructor(id,parameters,instructions,fila,columna)
    {
        this.id = id;
        this.parameters =parameters;
        this.instructions = instructions;
        this.fila = fila;
        this.columna =columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

}