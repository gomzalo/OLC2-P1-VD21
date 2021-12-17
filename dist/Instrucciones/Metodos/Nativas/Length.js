"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Length = void 0;
const Errores_1 = require("../../../Ast/Errores");
const Nodo_1 = require("../../../Ast/Nodo");
const Tipo_1 = require("../../../TablaSimbolos/Tipo");
class Length {
    constructor(id, fila, columna) {
        this.id = id;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let arr = table.getSymbolTabla(this.id);
        // console.log("pop type: " + arr.tipo);
        if (arr != null) {
            if (arr.getArreglo() || arr.getTipo() == Tipo_1.TIPO.CADENA) {
                if (arr.getValor().length > 0) {
                    this.tipo = arr.getTipo();
                    return arr.getValor().length;
                }
                else {
                    return new Errores_1.Errores("Semantico", `El arreglo con ID ${this.id}, esta vacio.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa LENGTH no puede utilizase en variable con ID ${this.id}, porque no es un arreglo o string.`, this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `La variable con ID ${this.id}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented LENGTH.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("Length", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }
}
exports.Length = Length;
