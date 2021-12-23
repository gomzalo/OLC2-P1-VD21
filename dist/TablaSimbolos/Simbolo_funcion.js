"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simbolo_funcion = void 0;
class Simbolo_funcion {
    constructor(func) {
        this.tipo = func.tipo;
        this.id = func.id;
        this.size = func.parameters.length;
        this.parameters = func.parameters;
    }
}
exports.Simbolo_funcion = Simbolo_funcion;
