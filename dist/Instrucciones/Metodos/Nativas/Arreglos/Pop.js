"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pop = void 0;
const Errores_1 = require("../../../../Ast/Errores");
class Pop {
    constructor(id, fila, columna) {
        this.id = id;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let arr = table.getSymbolTabla(this.id);
        // console.log("pop type: " + arr.tipo);
        if (arr != null) {
            if (arr.getArreglo()) {
                if (arr.getValor().length > 0) {
                    this.tipo = arr.getTipo();
                    return arr.getValor().pop();
                }
                else {
                    return new Errores_1.Errores("Semantico", `El arreglo con ID ${this.id}, esta vacio.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa POP no puede utilizase en variable con ID ${this.id}, porque no es un arreglo.`, this.fila, this.columna);
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
exports.Pop = Pop;
