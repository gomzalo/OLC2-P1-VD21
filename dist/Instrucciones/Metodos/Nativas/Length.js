"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Length = void 0;
const Errores_1 = require("../../../Ast/Errores");
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
                this.tipo = arr.getTipo();
                return arr.getValor().length;
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
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.Length = Length;
