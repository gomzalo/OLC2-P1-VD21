"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Continuar = void 0;
const Nodo_1 = require("../../Ast/Nodo");
const Errores_1 = require("../../Ast/Errores");
class Continuar {
    constructor(fila, columna) {
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        return this;
    }
    translate3d(table, tree) {
        const genc3d = tree.generadorC3d;
        if (table.continue == null) {
            return new Errores_1.Errores('Semantico', 'No se permite el uso de continue en la instrucción.', this.fila, this.columna);
        }
        genc3d.gen_Goto(table.continue);
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("CONTINUE", "");
        return padre;
    }
}
exports.Continuar = Continuar;
