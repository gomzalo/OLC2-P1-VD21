import exp from "constants";
import { Ast } from "../../Ast/Ast";
import { Errores } from "../../Ast/Errores";
import { Nodo } from "../../Ast/Nodo";
import { Instruccion } from "../../Interfaces/Instruccion";
import { Simbolo } from "../../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";

export  class ModificacionArr implements Instruccion{
    public id;
    public expresiones;
    public valor;
    public fila;
    public tipo_arr: TIPO;
    public columna;
    public arreglo = true;

    //ID lista_exp IGUAL expr
    constructor(id, expresiones, valor, fila, columna){
        this.id = id;
        this.expresiones = expresiones;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let value = this.valor.ejecutar(table, tree);
        if(value instanceof Errores){
            return value;
        }
        let simbolo = table.getSymbolTabla(this.id.toString());
        if(simbolo != null){
            if(simbolo.getArreglo()){
                if(simbolo.getTipo() != this.valor.tipo){
                    return new Errores("Semantico", "Tipos de datos diferentes en modificacion de arreglo: \'" + this.id + "\'.", this.fila, this.columna);
                }
                // console.log("modArr simb.tipo: " + simbolo.getTipo());
                this.tipo_arr = simbolo.getTipo();
                // console.log("TIPO mod: " + this.tipo_arr);
                let result = this.modificarDimensiones(table, tree, this.expresiones, simbolo.getValor(), value); // Devuelve el arreglo de dimensiones
                if(result instanceof Errores){
                    return result;
                }
                // result = this.valor;
                // return result;
            }else{
                return new Errores("Semantico", "La variable \'" + this.id + "\', no es un arreglo.", this.fila, this.columna);
            }
        }else{
            return new Errores("Semantico", "Variable: \'" + this.id.toString() + "\', no encontrada.", this.fila, this.columna);
        }
        return null;
    }

    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

    recorrer(table: TablaSimbolos, tree: Ast) {
        return new Nodo("Modificacion Array","");
    }
    dim = 0;
    public modificarDimensiones(table, tree, expresiones, arreglo, valor){
        // let value = null;
        if(expresiones.length == 0){
            if(arreglo instanceof Array){
                return new Errores("Semantico", "Modificacion de arreglo incompleto.", this.fila, this.columna);
            }
            return valor;
        }
        if(!(arreglo instanceof Array)){
            return new Errores("Semantico", "Acceso de mas en el arreglo.", this.fila, this.columna);
        }
        let exp_tmp = expresiones.shift();
        let num = exp_tmp.ejecutar(table, tree);
        if(num instanceof Errores){
            return num;
        }
        if(exp_tmp.tipo != TIPO.ENTERO){
            return new Errores("Semantico", "Expresion diferente a entero en arreglo.", this.fila, this.columna);
        }
        // console.log("modArr exp: " + valor);
        // console.log("modArr tipo exp: " + this.valor.tipo);
        if(this.valor.tipo != this.tipo_arr){
            // console.log("Tipo distinto al tipo del arreglo");
            // console.log(tree);
            return new Errores("Semantico", "Tipo distinto al tipo del arreglo.", this.fila, this.columna);
        }else{
            if(arreglo[num] != undefined){
                let value = this.modificarDimensiones(tree, table, expresiones.slice(), arreglo[num][0], valor);
                if(value instanceof Errores){
                    return value;
                }
                // console.log("arreglo[num]: " + arreglo[num].toString());
                if(value != null){
                    arreglo[num] = valor;
                }
            }else{
                // console.log("null");
                return new Errores("Semantico", "Posicion inexistente en el arreglo.", this.fila, this.columna);
            }
        }
        return null;
    }
    
}
