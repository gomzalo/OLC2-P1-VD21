import { Ast } from "../../Ast/Ast";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";

export class Llamada implements Instruccion{
    public id: string;
    public parameters : Array<any>;
    public fila : number;
    public columna : number;
    public arreglo : Boolean;

    constructor(id,parameters, fila, columna, arreglo =false)
    {
        this.id = id;
        this.parameters =parameters;
        this.fila = fila;
        this.columna = columna;
        this.arreglo = arreglo;
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