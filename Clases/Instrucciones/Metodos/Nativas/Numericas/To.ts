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
import { Identificador } from '../../../../Expresiones/Identificador';
import { Nodo } from '../../../../Ast/Nodo';

export class To implements Funcion{
    public fila: number;
    public columna: number;
    public tipo : TIPO;
    public id;
    public parameters;
    public instructions;
    public tipo_conversion;
    arreglo: boolean;
    /**
     * @function To Metodo para castear Enteros a Float y viceversa.
     * @param tipo_conversion toInt | toDouble
     * @param parameters Parametros a castear
     * @param fila 
     * @param columna 
     */
    constructor(tipo_conversion, parameters, fila, columna)
    {
        this.tipo_conversion = tipo_conversion;
        this.parameters = parameters;
        this.fila = fila;
        this.columna =columna;
    }
    public tipoStruct: any;
    /**
     * 
     * @param table 
     * @param tree 
     * @returns Valores casteados
     */
    ejecutar(table: TablaSimbolos, tree: Ast) {
        // console.log("parse params: " + this.parameters);
        let valor = this.parameters.ejecutar(table, tree);
        // console.log("parse valor: " + this.parameters.tipo);
        if(valor != null){
            if(!isNaN(valor)){
                switch (this.tipo_conversion) {
                    case "toInt":
                        try {
                            this.tipo = TIPO.ENTERO;
                            return parseInt(valor);
                        } catch (error) {
                            return new Errores("Semantico", `No fue posible castear a entero el valor '${valor.toString()}'.`, this.fila, this.columna);
                        }
                    case "toDouble":
                        try {
                            this.tipo = TIPO.DECIMAL;
                            return parseFloat(valor);
                        } catch (error) {
                            return new Errores("Semantico", `No fue posible castear a double el valor '${valor.toString()}'.`, this.fila, this.columna);
                        }
                    default:
                        return new Errores("Semantico", `No fue posible castear el valor '${valor.toString()}'.`, this.fila, this.columna);
                }
            }else{
                return new Errores("Semantico", `Nativa '${this.tipo_conversion}' no puede utilizarse, porque no es un numero.`, this.fila, this.columna);
            }
        }else{
            return new Errores("Semantico", `Valor invalido.`, this.fila, this.columna);
        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented TO_CONV.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre =  new Nodo("toLower","");
        padre.addChildNode(new Nodo(this.tipo_conversion.toString(),""));
        padre.addChildNode(this.parameters.recorrer(table,tree));
        return padre;
    }

}