"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pow = void 0;
const Errores_1 = require("../../../Ast/Errores");
const Tipo_1 = require("../../../TablaSimbolos/Tipo");
class Pow {
    /**
     * @function Pow Elevar un numero_base a un numero_potencia
     * @param expBase Base a elevar
     * @param expElevacion Potencia
     * @param fila
     * @param columna
     */
    constructor(expBase, expElevacion, fila, columna) {
        this.expBase = expBase;
        this.expElevacion = expElevacion;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let resBase = this.expBase.ejecutar(table, tree);
        if (resBase instanceof Errores_1.Errores) {
            return resBase;
        }
        let resElevacion = this.expElevacion.ejecutar(table, tree);
        if (resElevacion instanceof Errores_1.Errores) {
            return resElevacion;
        }
        if (this.expBase.tipo == Tipo_1.TIPO.ENTERO && this.expElevacion.tipo == Tipo_1.TIPO.ENTERO) {
            this.tipo = Tipo_1.TIPO.ENTERO;
            return Math.pow(resBase, resElevacion);
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
