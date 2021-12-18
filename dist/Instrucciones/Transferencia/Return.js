"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = void 0;
const Nodo_1 = require("../../Ast/Nodo");
const Errores_1 = require("../../Ast/Errores");
class Return {
    constructor(expresion, fila, columna) {
        this.expresion = expresion;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        if (this.expresion != null) {
            let valor = this.expresion.ejecutar(table, tree);
            if (valor instanceof Errores_1.Errores) {
                return valor;
            }
            this.tipo = this.expresion.tipo;
            this.valor = valor;
            return this;
        }
        else {
            return null;
        }
        // this.tipo = this.valor.tipo;
    }
    translate3d(table, tree) {
        const genc3d = tree.generadorC3d;
        if (table.continue == null) {
            return new Errores_1.Errores('Semantico', 'No se permite el uso de continue en la instrucción.', this.fila, this.columna);
        }
        genc3d.gen_Goto(table.continue);
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("RETURN", "");
        padre.addChildNode(new Nodo_1.Nodo("return", ""));
        if (this.valor != null) {
            padre.addChildNode(this.expresion.recorrer());
        }
        return padre;
    }
}
exports.Return = Return;
