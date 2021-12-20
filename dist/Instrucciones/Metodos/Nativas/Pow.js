"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pow = void 0;
const Errores_1 = require("../../../Ast/Errores");
const Nodo_1 = require("../../../Ast/Nodo");
const Tipo_1 = require("../../../TablaSimbolos/Tipo");
class Pow {
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
        let padre = new Nodo_1.Nodo("POW", "");
        let base = new Nodo_1.Nodo("Expresion Base", "");
        base.addChildNode(this.expBase.recorrer(table, tree));
        let elev = new Nodo_1.Nodo("Expresion Elevacion", "");
        elev.addChildNode(this.expBase.recorrer(table, tree));
        padre.addChildNode(base);
        padre.addChildNode(elev);
        return padre;
    }
}
exports.Pow = Pow;
