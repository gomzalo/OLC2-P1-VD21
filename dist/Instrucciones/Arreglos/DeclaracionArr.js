"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionArr = void 0;
const Errores_1 = require("../../Ast/Errores");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class DeclaracionArr {
    constructor(tipo_arr, dimensiones, id, expresiones, fila, columna) {
        this.tipo = Tipo_1.TIPO.ARREGLO;
        this.arreglo = true;
        this.arr = [];
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
        this.crearDimensiones(table, tree, this.expresiones[0].slice()); // Devuelve el arreglo de dimensiones
        let value = this.arr;
        console.log("value declArr: " + value);
        if (value instanceof Errores_1.Errores) {
            return value;
        }
        let nuevo_simb = new Simbolo_1.Simbolo(this.id.toString(), this.tipo_arr, null, this.fila, this.columna, value);
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
        if (expresiones.length == 0) {
            return;
        }
        else {
            console.log("entro crearD");
            let dimension = expresiones.pop();
            // alert("expr crearD arr: " + expresiones);
            // alert("expr crearD arr size: " + expresiones.length);
            let num = dimension.ejecutar(table, tree);
            this.arr.push(num);
            // alert("num arr: " + num);
            // if(num instanceof Errores){
            //     return num;
            // }
            // if(expresiones > 0){
            this.crearDimensiones(tree, table, expresiones.slice());
            // }s
        }
        // return this.arr;
    }
}
exports.DeclaracionArr = DeclaracionArr;
