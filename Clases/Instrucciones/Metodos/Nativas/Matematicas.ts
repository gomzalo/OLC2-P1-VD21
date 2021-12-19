import { Identificador } from './../../../Expresiones/Identificador';
import { Instruccion } from '../../../Interfaces/Instruccion';
import { Ast } from "../../../Ast/Ast";
import { Errores } from "../../../Ast/Errores";
import { TablaSimbolos } from "../../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../../TablaSimbolos/Tipo";
import { Detener } from "../../Transferencia/Break";
import { Continuar } from "../../Transferencia/Continuar";
import { Return } from "../../Transferencia/Return";
import { Funcion } from "../Funcion";
import { Nodo } from '../../../Ast/Nodo';

export class Matematicas implements Funcion{
    public fila: number;
    public columna: number;
    public tipo : TIPO;
    public expresion;
    public id;
    public tipo_funcion;
    public parameters: Array<any>;
    public instructions: Array<any>;
    arreglo: boolean;

    constructor(tipo_funcion, expresion, fila, columna)
    {
        this.tipo_funcion = tipo_funcion;
        this.expresion = expresion;
        this.fila = fila;
        this.columna =columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let expresion = this.expresion.ejecutar(table, tree);
        if(expresion != null){
            let valor;
            if(this.expresion instanceof Identificador){
                // console.log("es id");
                valor = expresion;
            }else{
                valor = this.expresion.valor;
            }
            if(!isNaN(valor)){
                this.tipo = this.expresion.tipo;
                switch (this.tipo_funcion.toString()) {
                    case "sin":
                        return Math.sin(valor* Math.PI / 180);
                    case "cos":
                        return Math.cos(valor* Math.PI / 180);
                    case "tan":
                        return Math.tan(valor* Math.PI / 180);
                    case "log10":
                        return Math.log10(valor);
                    case "sqrt":
                        return Math.sqrt(valor);
                    default:
                        return new Errores("Semantico", `Nativa '${this.tipo_funcion.toString()}' invalida.`, this.fila, this.columna);
                }
            }else{
                return new Errores("Semantico", `Nativa '${this.tipo_funcion.toString()}' solamente acepta expresiones numericos.`, this.fila, this.columna);
            }
        }else{
            return new Errores("Semantico", `La variable con ID ${this.expresion}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre =  new Nodo("Matematicas","");
        padre.addChildNode(new Nodo(this.id,"")); //this.tipo_funcion.toString()

        let tipoN =  new Nodo("TIPO_FUNCION","");
        tipoN.addChildNode(new Nodo(this.tipo_funcion.toString(),""));

        let instruccion =  new Nodo("INSTRUCCION","");
        instruccion.addChildNode(this.expresion.recorrer(table,tree));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        padre.addChildNode(tipoN);
        padre.addChildNode(instruccion);
        return padre;
    }
}