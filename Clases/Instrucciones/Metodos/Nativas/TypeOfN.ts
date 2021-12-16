import { Ast } from "../../../Ast/Ast";
import { Errores } from "../../../Ast/Errores";
import { Nodo } from "../../../Ast/Nodo";
import { Instruccion } from "../../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../../TablaSimbolos/Tipo";
import { Detener } from "../../Transferencia/Break";
import { Continuar } from "../../Transferencia/Continuar";
import { Return } from "../../Transferencia/Return";
import { Funcion } from "../Funcion";

export class TypeOfN implements Funcion{
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
        if(this.expresion instanceof Array){
            return "array";
        }else{
            let valor = this.expresion.ejecutar(table, tree);
            // console.log("pop type: " + valor.tipo);
            if(valor != null){
                this.tipo = valor.tipo;
                return this.getTipo(this.expresion.tipo);
            }else{
                return new Errores("Semantico", `Valor nulo.`, this.fila, this.columna);
            }
        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre =  new Nodo("TypeOfN","");
        // padre.addChildNode(new Nodo(this.id,""));
        if(this.expresion instanceof Array){
            padre.addChildNode(new Nodo("array",""));
        }else{
            padre.addChildNode(this.expresion.recorrer(table,tree));
        }
        
        return padre;
    }

    getTipo(tipo){
        switch(tipo){
            case TIPO.CADENA:
                return "String";
            case TIPO.ENTERO:
                return "int";
            case TIPO.DECIMAL:
                return "double";
            case TIPO.BOOLEANO:
                return "boolean";
            case TIPO.CHARACTER:
                return "char";
            case TIPO.ARREGLO:
                return "array";
            case TIPO.STRUCT:
                return "struct";
            case TIPO.RANGO:
                return "rango";
            case TIPO.NULO:
                return "null";
            default:
                return "invalido";
        }
    }

}