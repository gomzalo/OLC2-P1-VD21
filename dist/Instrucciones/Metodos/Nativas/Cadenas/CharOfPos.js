"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharOfPos = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Tipo_1 = require("../../../../TablaSimbolos/Tipo");
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
                let pos = this.expresion.ejecutar(table, tree);
                console.log("charofpos tipo cadena: " + cadena.getTipo());
                console.log("charofpos tipo pos: " + this.expresion);
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
        throw new Error("Method not implemented.");
    }
}
exports.CharOfPos = CharOfPos;
