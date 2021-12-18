"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Retorno = void 0;
class Retorno {
    constructor(valor, istemp, tipo, simbolo = null) {
        this.valor = valor;
        this.istemp = istemp;
        this.tipo = tipo;
        this.lblTrue = this.lblFalse = '';
        this.simbolo = simbolo;
    }
    translate3d() {
        return this.valor;
    }
}
exports.Retorno = Retorno;
