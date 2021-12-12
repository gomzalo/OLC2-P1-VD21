"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionArr = void 0;
const Errores_1 = require("../../Ast/Errores");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class DeclaracionArr {
    //tipo lista_dim ID IGUAL lista_exp_arr
    constructor(tipo_arr, dimensiones, id, expresiones, fila, columna) {
        this.tipo = Tipo_1.TIPO.ARREGLO;
        this.arreglo = true;
        this.arr = Array();
        this.tipo_arr = tipo_arr;
        this.dimensiones = dimensiones;
        this.id = id;
        this.expresiones = expresiones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // Verificando dimensiones
        if (this.dimensiones != this.dimensiones.length) {
            return new Errores_1.Errores("Semantico", "Dimensiones diferentes en el arreglo.", this.fila, this.columna);
        }
        // Creando arreglo
        this.crearDimensiones(table, tree, this.expresiones); // Devuelve el arreglo de dimensiones
        // let value = this.crearDimensiones(table, tree, this.expresiones[0].slice()); // Devuelve el arreglo de dimensiones
        let value = this.arr;
        // console.log("value declArr: " + value);
        // console.log("type declArr: " + typeof(value));
        // console.log("type declArr: " + typeof(this.arr));
        // console.log("tipo declArr: " + this.tipo_arr);
        if (value instanceof Errores_1.Errores) {
            return value;
        }
        let nuevo_simb = new Simbolo_1.Simbolo(this.id.toString(), this.tipo_arr, true, this.fila, this.columna, value);
        let result = table.setSymbolTabla(nuevo_simb);
        if (result instanceof Errores_1.Errores) {
            return result;
        }
        return null;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
    crearDimensiones(table, tree, expresiones) {
        // console.log("expr crearD arr: " + expresiones);
        while (true) {
            if (!(expresiones.length == 0)) {
                let dimension = expresiones.shift();
                // console.log("entro crearD");
                // console.log("dim crearD arr: " + dimension);
                if (Array.isArray(dimension)) {
                    this.arr.push(this.crearDimensiones(table, tree, dimension));
                }
                else {
                    let num = dimension.ejecutar(table, tree);
                    console.log("crearArr: num.tipo " + dimension.tipo);
                    console.log("crearArr: this.tipo_arr " + this.tipo_arr);
                    if (dimension.tipo != this.tipo_arr) {
                        console.log("Tipo distinto al tipo del arreglo");
                        console.log(tree);
                        let res = new Errores_1.Errores("Semantico", "Tipo distinto al tipo del arreglo.", this.fila, this.columna);
                        tree.Errores.push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }
                    else {
                        this.arr.push(num);
                        this.crearDimensiones(tree, table, expresiones);
                    }
                }
            }
            else {
                break;
            }
        }
    }
}
exports.DeclaracionArr = DeclaracionArr;
