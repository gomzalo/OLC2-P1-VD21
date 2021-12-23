"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Retorno = void 0;
class Retorno {
    constructor(valor, istemp, tipo, simbolo = null, table, tree) {
        this.valor = valor;
        this.istemp = istemp;
        this.tipo = tipo;
        this.lblTrue = this.lblFalse = '';
        this.simbolo = simbolo;
        this.table = table;
        this.tree = tree;
    }
    translate3d() {
        if (this.istemp) {
            this.tree.generadorC3d.freeTemp(this.valor);
        }
        return this.valor;
    }
}
exports.Retorno = Retorno;
