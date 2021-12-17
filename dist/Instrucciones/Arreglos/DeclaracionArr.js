"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionArr = void 0;
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
const Copiar_1 = require("../../Expresiones/Arreglos/Copiar");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
class DeclaracionArr {
    //tipo lista_dim ID IGUAL lista_exp_arr
    constructor(tipo, dimensiones, id, expresiones, fila, columna) {
        this.arreglo = true;
        this.arr = Array();
        this.tipo = tipo;
        this.dimensiones = dimensiones;
        this.id = id;
        this.expresiones = expresiones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // if(this.expresiones != null){
        //     console.log("declArr exp: " + this.expresiones);
        // }
        // Creando arreglo
        let value;
        // ASIGNACION
        if (this.tipo == null && this.dimensiones == null) {
            // Asignando variable de tipo arreglo con su valor
            if (table.existe(this.id)) {
                // Creando arreglo
                this.tipo = table.getSymbolTabla(this.id).getTipo();
                if (this.expresiones instanceof Copiar_1.Copiar) {
                    // console.log("AS ARR COPIAR");
                    value = this.expresiones.ejecutar(table, tree);
                    // console.log("AS ARR COPIAR VAL: " + value);
                    if (value == null) {
                        return new Errores_1.Errores("Semantico", "Arreglo nulo.", this.fila, this.columna);
                    }
                }
                else {
                    // console.log("AS ARR ");
                    value = this.crearDimensiones(table, tree, this.expresiones.slice()); // Devuelve el arreglo de dimensiones
                    // let value = this.crearDimensiones(table, tree, this.expresiones[0].slice()); // Devuelve el arreglo de dimensiones
                    // value = this.arr;
                    // console.log("value declArr: " + value);
                    // console.log("type declArr: " + typeof(value));
                    // console.log("type declArr: " + typeof(this.arr));
                    // console.log("tipo declArr: " + this.tipo);
                    if (value instanceof Errores_1.Errores) {
                        return value;
                    }
                }
                // Creando simbolo
                let nuevo_simb = new Simbolo_1.Simbolo(this.id.toString(), this.tipo, true, this.fila, this.columna, value);
                if (nuevo_simb.arreglo) {
                    // Obteniendo variable y asignar valor
                    let result = table.updateSymbolTabla(nuevo_simb);
                    if (result instanceof Errores_1.Errores) {
                        return result;
                    }
                }
                else {
                    return new Errores_1.Errores("Semantico", `La variable '${this.id}', no es de tipo arreglo.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", "Variable no encontrada.", this.fila, this.columna);
            }
        } // DECLARACION
        else if (this.expresiones == null) {
            // console.log("DECL ARR ");
            // Verificando dimensiones
            if (this.dimensiones != null) {
                if (this.dimensiones != this.dimensiones.length) {
                    return new Errores_1.Errores("Semantico", "Dimensiones diferentes en el arreglo.", this.fila, this.columna);
                }
            }
            // Creando variable de tipo arreglo
            let nuevo_simb = new Simbolo_1.Simbolo(this.id.toString(), this.tipo, true, this.fila, this.columna, []);
            let result = table.setSymbolTabla(nuevo_simb);
            if (result instanceof Errores_1.Errores) {
                return result;
            }
        } // DECLARACION Y ASIGNACION
        else {
            // Verificando dimensiones
            if (this.dimensiones != null) {
                if (this.dimensiones != this.dimensiones.length) {
                    return new Errores_1.Errores("Semantico", "Dimensiones diferentes en el arreglo.", this.fila, this.columna);
                }
            }
            // Creando arreglo
            if (this.expresiones instanceof Copiar_1.Copiar) {
                // console.log("DECL Y AS ARR COPIAR");
                value = this.expresiones.ejecutar(table, tree);
                // console.log("DECL ARR COPIAR VAL: " + value);
                if (value == null) {
                    return new Errores_1.Errores("Semantico", "Arreglo nulo.", this.fila, this.columna);
                }
            }
            else {
                // console.log("DECL Y AS ARR ");
                value = this.crearDimensiones(table, tree, this.expresiones[0].slice()); // Devuelve el arreglo de dimensiones
                // console.log("crearArr value: " + value);
                // console.log("crearArr size: " + value.length);
                // let value = this.crearDimensiones(table, tree, this.expresiones[0].slice()); // Devuelve el arreglo de dimensiones
                // value = this.arr;
                // console.log("value declArr: " + value);
                // console.log("type declArr: " + typeof(value));
                // console.log("type declArr: " + typeof(this.arr));
                // console.log("tipo declArr: " + this.tipo);
                if (value instanceof Errores_1.Errores) {
                    return value;
                }
            }
            // Creando variable de tipo arreglo con su valor
            let nuevo_simb = new Simbolo_1.Simbolo(this.id.toString(), this.tipo, true, this.fila, this.columna, value);
            let result = table.setSymbolTabla(nuevo_simb);
            if (result instanceof Errores_1.Errores) {
                return result;
            }
        }
        return null;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented DECLARR.");
    }
    recorrer(table, tree) {
        return new Nodo_1.Nodo("Modificacion Array", "");
    }
    crearDimensiones(table, tree, expresiones) {
        let arr = Array();
        while (true) {
            if (!(expresiones.length == 0)) {
                let dimension = expresiones.shift();
                // console.log("crearArr dim: " + dimension);
                if (Array.isArray(dimension)) {
                    arr.push([this.crearDimensiones(table, tree, dimension.slice())]);
                }
                else {
                    let num = dimension.ejecutar(table, tree);
                    if (dimension.tipo != this.tipo) {
                        let res = new Errores_1.Errores("Semantico", "Tipo distinto al tipo del arreglo.", this.fila, this.columna);
                        tree.Errores.push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }
                    else {
                        dimension.tipo = this.tipo;
                        arr.push(num);
                        this.crearDimensiones(tree, table, expresiones.slice());
                    }
                }
            }
            else {
                break;
            }
        }
        return arr;
    }
}
exports.DeclaracionArr = DeclaracionArr;
