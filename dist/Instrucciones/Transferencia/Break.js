"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Detener = void 0;
const Nodo_1 = require("../../Ast/Nodo");
class Detener {
    constructor(fila, columna) {
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        return this;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("Break", "");
        return padre;
    }
}
exports.Detener = Detener;
