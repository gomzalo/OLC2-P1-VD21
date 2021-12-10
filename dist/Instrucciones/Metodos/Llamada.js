"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Llamada = void 0;
class Llamada {
    constructor(id, parameters, fila, columna, arreglo = false) {
        this.id = id;
        this.parameters = parameters;
        this.fila = fila;
        this.columna = columna;
        this.arreglo = arreglo;
    }
    ejecutar(table, tree) {
        throw new Error("Method not implemented.");
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.Llamada = Llamada;
