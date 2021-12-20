"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pop = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Nodo_1 = require("../../../../Ast/Nodo");
class Pop {
    /**
     * @function Pop Elimina y devuelve el ultimo valor de un arreglo.
     * @param id ID del arreglo del que se obtendra su ultimo valor.
     * @param fila
     * @param columna
     */
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
        throw new Error("Method not implemented POP.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("POP", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        return padre;
    }
}
exports.Pop = Pop;
