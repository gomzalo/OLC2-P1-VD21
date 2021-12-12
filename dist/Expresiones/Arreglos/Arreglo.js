"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arreglo = void 0;
const Nodo_1 = require("../../Ast/Nodo");
class Arreglo {
    constructor(tipo, valor, fila, columna) {
        this.tipo = tipo;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        return this.valor;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Rango", "");
        return padre;
    }
}
exports.Arreglo = Arreglo;
