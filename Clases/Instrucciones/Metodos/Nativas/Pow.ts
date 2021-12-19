import { Ast } from "../../../Ast/Ast";
import { Errores } from "../../../Ast/Errores";
import { Nodo } from "../../../Ast/Nodo";
import { Instruccion } from "../../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../../TablaSimbolos/Tipo";
import { Funcion } from "../Funcion";

export class Pow implements Funcion{
    public fila: number;
    public columna: number;
    public tipo: TIPO;
    public id: string;
    public parameters: any[];
    public instructions: Instruccion[];
    arreglo: boolean;
    public expBase;
    public expElevacion;

    constructor(expBase,expElevacion,fila, columna){
        this.expBase =expBase;
        this.expElevacion =expElevacion;
        this.fila =fila;
        this.columna =columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let resBase = this.expBase.this.ejecutar(table,tree);
        if(resBase instanceof Errores)
        {
            return resBase;
        }   
        let expElevacion = this.expBase.this.ejecutar(table,tree);
        if(expElevacion instanceof Errores)
        {
            return expElevacion;
        }   

        
    }
    translate3d(table: TablaSimbolos, tree: Ast): void {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast): Nodo {
        throw new Error("Method not implemented.");
    }
}