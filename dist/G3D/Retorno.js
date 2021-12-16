"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Retorno = void 0;
class Retorno {
    constructor(valor, istemp, tipo) {
        this.valor = valor;
        this.istemp = istemp;
        this.tipo = tipo;
        this.lblTrue = this.lblFalse = '';
    }
    translate3d() {
        return this.valor;
    }
}
exports.Retorno = Retorno;
