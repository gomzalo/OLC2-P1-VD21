"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Detener = void 0;
const Errores_1 = require("./../../Ast/Errores");
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
        const genc3d = tree.generadorC3d;
        if (table.break == null) {
            return new Errores_1.Errores('Semantico', 'No se permite el uso de break en la instrucción.', this.fila, this.columna);
        }
        genc3d.gen_Goto(table.break);
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("Break", "");
        return padre;
    }
}
exports.Detener = Detener;
