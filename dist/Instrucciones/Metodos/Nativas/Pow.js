"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pow = void 0;
const Errores_1 = require("../../../Ast/Errores");
class Pow {
    constructor(expBase, expElevacion, fila, columna) {
        this.expBase = expBase;
        this.expElevacion = expElevacion;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let resBase = this.expBase.this.ejecutar(table, tree);
        if (resBase instanceof Errores_1.Errores) {
            return resBase;
        }
        let expElevacion = this.expBase.this.ejecutar(table, tree);
        if (expElevacion instanceof Errores_1.Errores) {
            return expElevacion;
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.Pow = Pow;
