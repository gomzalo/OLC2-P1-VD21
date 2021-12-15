"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Copiar = void 0;
const Nodo_1 = require("../../Ast/Nodo");
const Errores_1 = require("../../Ast/Errores");
class Copiar {
    constructor(id, fila, columna) {
        this.id = id;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // console.log("COPARR: " + this.id);
        let simbolo = table.getSymbolTabla(this.id.toString());
        if (simbolo != null) {
            if (simbolo.getArreglo()) {
                this.tipo = simbolo.getTipo();
                return simbolo.getValor();
            }
            else {
                return new Errores_1.Errores("Semantico", "La variable \'" + this.id + "\', no es un arreglo.", this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", "No se encontro la variable " + this.id + ".", this.fila, this.columna);
        }
        return null;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("Copiar", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }
}
exports.Copiar = Copiar;
