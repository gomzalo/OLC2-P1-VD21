"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = void 0;
const Nodo_1 = require("../../Ast/Nodo");
const Errores_1 = require("../../Ast/Errores");
class Return {
    constructor(expresion) {
        this.expresion = expresion;
    }
    ejecutar(table, tree) {
        if (this.expresion != null) {
            this.valor = this.expresion.ejecutar(table, tree);
            if (this.valor instanceof Errores_1.Errores) {
                return this.valor;
            }
            this.tipo = this.expresion.tipo;
            return this;
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
