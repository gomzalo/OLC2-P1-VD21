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
import { Nodo } from '../../../../Ast/Nodo';

export class Parse implements Funcion{
    public fila: number;
    public columna: number;
    public tipo : TIPO;
    public id;
    public parameters;
    public instructions;
    public tipo_funcion;
    arreglo: boolean;
    /**
     * @function Parse Toma una cadena y la convierte al tipo indicado
     * @param tipo_funcion int | double | boolean
     * @param parameters Cadena a castear
     * @param fila 
     * @param columna 
     */
    constructor(tipo_funcion, parameters, fila, columna)
    {
        this.tipo_funcion = tipo_funcion;
        this.parameters = parameters;
        this.fila = fila;
        this.columna =columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        // console.log("parse params: " + this.parameters);
        let cadena = this.parameters.ejecutar(table, tree);
        // console.log("parse cadena: " + this.parameters.tipo);
        if(cadena != null){
            if(this.parameters.tipo == TIPO.CADENA){                
                switch (this.tipo_funcion) {
                    case TIPO.ENTERO:
                        try {
                            this.tipo = TIPO.ENTERO;
                            return parseInt(cadena);
                        } catch (error) {
                            return new Errores("Semantico", `No fue posible castear a entero el valor '${cadena.toString()}'.`, this.fila, this.columna);
                        }
                    case TIPO.DECIMAL:
                        try {
                            this.tipo = TIPO.DECIMAL;
                            return parseFloat(cadena);
                        } catch (error) {
                            return new Errores("Semantico", `No fue posible castear a double el valor '${cadena.toString()}'.`, this.fila, this.columna);
                        }
                    case TIPO.BOOLEANO:
                        try {
                            this.tipo = TIPO.BOOLEANO;
                            if(cadena == "1" || cadena.toUpperCase() == "true".toUpperCase()){
                                return true;
                            }else if(cadena == "0" || cadena.toUpperCase() == "false".toUpperCase()){
                                return false;
                            }else{
                                return new Errores("Semantico", `Valor: '${cadena.toString()}', invalido para castear a booleano.`, this.fila, this.columna);
                            }
                        } catch (error) {
                            return new Errores("Semantico", `No fue posible castear a booleano el valor '${cadena.toString()}'.`, this.fila, this.columna);
                        }
                    default:
                        return new Errores("Semantico", `No fue posible castear el valor '${cadena.toString()}'.`, this.fila, this.columna);
                }
            }else{
                return new Errores("Semantico", `Nativa 'PARSE' no puede utilizarse, porque '${cadena.toString()}' no es una cadena.`, this.fila, this.columna);
            }
        }else{
            return new Errores("Semantico", `La variable con ID ${this.id}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented PARSE.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre =  new Nodo("Parse","");
        padre.addChildNode(new Nodo(this.id,""));
        padre.addChildNode(this.parameters.recorrer(table,tree));
        return padre;
    }

}