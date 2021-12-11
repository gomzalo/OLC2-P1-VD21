"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rango = void 0;
const Nodo_1 = require("../../Ast/Nodo");
class Rango {
    constructor(tipo, inicio, fin, fila, columna) {
        this.tipo = tipo;
        this.inicio = inicio;
        this.fin = fin;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let valor = [];
        valor.push(this.inicio);
        valor.push(this.fin);
        return valor;
    }
    getValor() {
        let valor = [];
        valor.push(this.inicio);
        valor.push(this.fin);
        return valor;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Rango", "");
        return padre;
    }
}
exports.Rango = Rango;
