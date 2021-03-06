import { Ast } from "../../Ast/Ast";
import { Errores } from "../../Ast/Errores";
import { Nodo } from "../../Ast/Nodo";
import { Identificador } from "../../Expresiones/Identificador";
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
    /**
     * @function ModificacionArr Modifica un arreglo ya declarado.
     * @param id ID del arreglo a modificar.
     * @param expresiones Posicion del arreglo a modificar.
     * @param valor Nuevo valor que se desea asignar en la posicion indicada al arreglo.
     * @param fila 
     * @param columna 
     */
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
                this.tipo_arr = simbolo.getTipo();
                if(this.expresiones.length == 1){
                    let indice;
                    // if(this.expresiones instanceof Identificador){
                    //     let simbolo_iterador = table.getSymbolTabla(this.expresiones.id);
                    //     if(simbolo_iterador == null){
                    //         return new Errores("Semantico", "No se encontro la variable " + this.expresiones[0].id + ".", this.fila, this.columna);
                    //     }
                    //     indice = simbolo_iterador.valor;
                    // }else{
                        indice = this.expresiones[0].ejecutar(table, tree);
                        // console.log("indice mod arr: " + indice);
                    // }
                    if(!Number.isInteger(indice)){
                        return new Errores('Semantico', `Indice no es un entero`, this.fila, this.columna);
                    }
                    if(indice >= simbolo.getValor().length){
                        return new Errores('Semantico', `Indice ${indice}, no existe en arreglo.`, this.fila, this.columna);
                    }else{
                        simbolo.getValor()[indice] = value;
                        return simbolo.getValor()[indice];
                    }
                }else{
                    let result = this.modificarDimensiones(table, tree, this.expresiones, simbolo.getValor(), value); // Devuelve el arreglo de dimensiones
                    if(result instanceof Errores){
                        return result;
                    }
                    // result = this.valor;
                    // return result;
                }
            }else{
                return new Errores("Semantico", "La variable \'" + this.id + "\', no es un arreglo.", this.fila, this.columna);
            }
        }else{
            return new Errores("Semantico", "Variable: \'" + this.id.toString() + "\', no encontrada.", this.fila, this.columna);
        }
        return null;
    }

    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented MODARR.");
    }

    recorrer(table: TablaSimbolos, tree: Ast) {
        return new Nodo("Modificacion Array","");
    }
    dim = 0;
    public modificarDimensiones(table, tree, expresiones, arreglo, valor){
        // let value = null;
        if(expresiones.length == 0){
            // if(arreglo instanceof Array){
            //     return new Errores("Semantico", "Modificacion de arreglo incompleto.", this.fila, this.columna);
            // }
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
