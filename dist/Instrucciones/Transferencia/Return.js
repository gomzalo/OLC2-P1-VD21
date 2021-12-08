"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = void 0;
const Nodo_1 = require("../../Ast/Nodo");
class Return {
    constructor(valor) {
        this.valor = valor;
    }
    ejecutar(table, tree) {
        if (this.valor != null) {
            return this.valor.ejecutar(table, tree);
        }
        else {
            return null;
        }
        // this.tipo = this.valor.tipo;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("RETURN", "");
        padre.addChildNode(new Nodo_1.Nodo("return", ""));
        if (this.valor != null) {
            // padre.addChildNode(this.valor.recorrer());
        }
        return padre;
    }
}
exports.Return = Return;
