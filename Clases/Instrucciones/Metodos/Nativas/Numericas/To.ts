import { toUpper } from './../Cadenas/toUpper';
import { Instruccion } from '../../../../Interfaces/Instruccion';
import { Ast } from "../../../../Ast/Ast";
import { Errores } from "../../../../Ast/Errores";
import { TablaSimbolos } from "../../../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../../../TablaSimbolos/Tipo";
import { Detener } from "../../../Transferencia/Break";
import { Continuar } from "../../../Transferencia/Continuar";
import { Return } from "../../../Transferencia/Return";
import { Funcion } from "../../Funcion";
import { resourceUsage } from 'process';
import { Identificador } from '../../../../Expresiones/Identificador';

export class To implements Funcion{
    public fila: number;
    public columna: number;
    public tipo : TIPO;
    public id;
    public parameters;
    public instructions;
    public tipo_conversion;
    arreglo: boolean;

    constructor(tipo_conversion, parameters, fila, columna)
    {
        this.tipo_conversion = tipo_conversion;
        this.parameters = parameters;
        this.fila = fila;
        this.columna =columna;
    }
    /**
     * 
     * @param table 
     * @param tree 
     * @returns Valores casteados
     */
    ejecutar(table: TablaSimbolos, tree: Ast) {
        // console.log("parse params: " + this.parameters);
        let cadena = this.parameters.ejecutar(table, tree);
        // console.log("parse cadena: " + this.parameters.tipo);
        if(cadena != null){
            if(!isNaN(cadena)){
                this.tipo = this.tipo_conversion;
                switch (this.tipo_conversion) {
                    case "toInt":
                        try {
                            return parseInt(cadena);
                        } catch (error) {
                            return new Errores("Semantico", `No fue posible castear a entero el valor '${cadena.toString()}'.`, this.fila, this.columna);
                        }
                    case "toDouble":
                        try {
                            return parseFloat(cadena);
                        } catch (error) {
                            return new Errores("Semantico", `No fue posible castear a double el valor '${cadena.toString()}'.`, this.fila, this.columna);
                        }
                    default:
                        return new Errores("Semantico", `No fue posible castear el valor '${cadena.toString()}'.`, this.fila, this.columna);
                }
            }else{
                return new Errores("Semantico", `Nativa '${this.tipo_conversion}' no puede utilizarse, porque no es un numero.`, this.fila, this.columna);
            }
        }else{
            return new Errores("Semantico", `Valor invalido.`, this.fila, this.columna);
        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

}