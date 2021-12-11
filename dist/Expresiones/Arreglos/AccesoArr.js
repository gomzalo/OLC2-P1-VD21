"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoArr = void 0;
const Errores_1 = require("../../Ast/Errores");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class AccesoArr {
    constructor(id, expresiones, fila, columna) {
        this.id = id;
        this.expresiones = expresiones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let simbolo = table.getSymbolTabla(this.id);
        if (simbolo == null) {
            return new Errores_1.Errores("Semantico", "No se encontro la variable " + this.id + ".", this.fila, this.columna);
        }
        this.tipo = simbolo.getTipo();
        if (!simbolo.getArreglo()) {
            return new Errores_1.Errores("Semantico", "La variable " + this.id + ", no es un arreglo.", this.fila, this.columna);
        }
        let value = this.buscarDimensiones(table, tree, this.expresiones, simbolo.getValor());
        console.log("val acc arr: " + value);
        if (value instanceof Errores_1.Errores) {
            return value;
        }
        if (value instanceof Array) {
            return new Errores_1.Errores("Semantico", "Acceso a arreglo incompleto.", this.fila, this.columna);
        }
        return value;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
    buscarDimensiones(table, tree, expresiones, arreglo) {
        let value = null;
        if (expresiones.length == 0) {
            return arreglo;
        }
        if (!(arreglo instanceof Array)) {
            return new Errores_1.Errores("Semantico", "Acceso de mas en el arreglo.", this.fila, this.columna);
        }
        let dimension = expresiones.pop();
        let num = dimension.ejecutar(table, tree);
        if (num instanceof Errores_1.Errores) {
            return num;
        }
        if (dimension.tipo != Tipo_1.TIPO.ENTERO) {
            return new Errores_1.Errores("Semantico", "Expresion diferente a entero en arreglo.", this.fila, this.columna);
        }
        value = this.buscarDimensiones(tree, table, expresiones, arreglo[num]);
        return value;
    }
}
exports.AccesoArr = AccesoArr;
