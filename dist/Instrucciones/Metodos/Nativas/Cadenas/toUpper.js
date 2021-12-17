"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUpper = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Tipo_1 = require("../../../../TablaSimbolos/Tipo");
const Nodo_1 = require("../../../../Ast/Nodo");
class toUpper {
    constructor(id, fila, columna) {
        this.id = id;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // console.log("push id: " + this.id.id);
        let cadena = table.getSymbolTabla(this.id);
        if (cadena != null) {
            if (cadena.getTipo() == Tipo_1.TIPO.CADENA && !cadena.getArreglo()) {
                this.tipo = cadena.getTipo();
                if (cadena.getValor().length > 0) {
                    return cadena.getValor().toUpperCase();
                }
                else {
                    return new Errores_1.Errores("Semantico", `La cadena en la variable con ID: '${this.id} es vacia'.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa 'toUppercase' no puede utilizase en variable con ID ${this.id}, porque no es una cadena.`, this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `La variable con ID ${this.id}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented TOUPP.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("toLower", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }
}
exports.toUpper = toUpper;
