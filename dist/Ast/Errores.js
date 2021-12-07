"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Errores {
    constructor(tipo, descripcion, fila, columna) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.fila = fila;
        this.columna = columna;
    }
}
exports.default = Errores;
