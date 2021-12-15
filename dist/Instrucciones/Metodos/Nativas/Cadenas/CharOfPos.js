"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharOfPos = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Tipo_1 = require("../../../../TablaSimbolos/Tipo");
const Nodo_1 = require("../../../../Ast/Nodo");
class CharOfPos {
    constructor(id, expresion, fila, columna) {
        this.id = id;
        this.expresion = expresion;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // console.log("push id: " + this.id.id);
        let cadena = table.getSymbolTabla(this.id);
        if (cadena != null) {
            if (cadena.getTipo() == Tipo_1.TIPO.CADENA && !cadena.getArreglo()) {
                this.tipo = cadena.getTipo();
                if (!(cadena.getValor().length > 0)) {
                    return new Errores_1.Errores("Semantico", `La cadena en la variable con ID: '${this.id} es vacia'.`, this.fila, this.columna);
                }
                let pos = this.expresion.ejecutar(table, tree);
                if (pos == null) {
                    return new Errores_1.Errores("Semantico", `No se obtuvo una posicion ${pos}.`, this.fila, this.columna);
                }
                // console.log("charofpos tipo cadena: " + cadena.getTipo());
                // console.log("charofpos tipo pos: " + this.expresion);
                let tam = cadena.getValor().length;
                if (this.expresion.tipo == Tipo_1.TIPO.ENTERO) {
                    if (pos < tam) {
                        return cadena.getValor().charAt(pos);
                    }
                    else {
                        return new Errores_1.Errores("Semantico", `La posicion ${pos} no se encuentra dentro de ${this.id}.`, this.fila, this.columna);
                    }
                }
                else {
                    return new Errores_1.Errores("Semantico", `La posicion ${pos} no es un entero.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa 'caracterOfPosition' no puede utilizase en variable con ID ${this.id}, porque no es una cadena.`, this.fila, this.columna);
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
        let padre = new Nodo_1.Nodo("CharOfPos", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        let instruccion = new Nodo_1.Nodo("INSTRUCCION", "");
        instruccion.addChildNode(this.expresion.recorrer(table, tree));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        padre.addChildNode(instruccion);
        return padre;
    }
}
exports.CharOfPos = CharOfPos;
