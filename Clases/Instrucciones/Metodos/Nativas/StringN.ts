import { Ast } from "../../../Ast/Ast";
import { Errores } from "../../../Ast/Errores";
import { Instruccion } from "../../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../../TablaSimbolos/Tipo";
import { Detener } from "../../Transferencia/Break";
import { Continuar } from "../../Transferencia/Continuar";
import { Return } from "../../Transferencia/Return";
import { Funcion } from "../Funcion";

export class StringN implements Funcion{
    public fila: number;
    public columna: number;
    public tipo : TIPO;
    public id : string;
    public parameters: Array<any>;
    public instructions : Array<Instruccion>;
    expresion;
    arreglo: boolean;

    constructor(expresion, fila, columna)
    {
        this.expresion = expresion;
        this.fila = fila;
        this.columna =columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let valor = this.expresion.ejecutar(table, tree);
        // console.log("pop type: " + valor.tipo);
        if(valor != null){
            this.tipo = valor.tipo;
            try {
                return valor.toString();
            } catch (error) {
                return new Errores("Semantico", `No fue posible castear a String el valor '${valor.toString()}'.`, this.fila, this.columna);
            }
        }else{
            return new Errores("Semantico", `La variable con ID ${this.expresion}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

}