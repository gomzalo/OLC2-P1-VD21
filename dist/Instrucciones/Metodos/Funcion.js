"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
class Funcion {
    constructor(id, parameters, instructions, fila, columna) {
        this.id = id;
        this.parameters = parameters;
        this.instructions = instructions;
        this.fila = fila;
        this.columna = columna;
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
exports.Funcion = Funcion;
