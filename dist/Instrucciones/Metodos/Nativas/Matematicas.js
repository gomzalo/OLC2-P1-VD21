"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matematicas = void 0;
const Identificador_1 = require("./../../../Expresiones/Identificador");
const Errores_1 = require("../../../Ast/Errores");
class Matematicas {
    constructor(tipo_funcion, expresion, fila, columna) {
        this.tipo_funcion = tipo_funcion;
        this.expresion = expresion;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let expresion = this.expresion.ejecutar(table, tree);
        if (expresion != null) {
            let valor;
            if (this.expresion instanceof Identificador_1.Identificador) {
                console.log("es id");
                valor = expresion;
            }
            else {
                valor = this.expresion.valor;
            }
            if (!isNaN(valor)) {
                this.tipo = this.expresion.tipo;
                switch (this.tipo_funcion.toString()) {
                    case "sin":
                        return Math.sin(valor);
                    case "cos":
                        return Math.cos(valor);
                    case "tan":
                        return Math.tan(valor);
                    case "log10":
                        return Math.log10(valor);
                    case "sqrt":
                        return Math.sqrt(valor);
                    default:
                        return new Errores_1.Errores("Semantico", `Nativa '${this.tipo_funcion.toString()}' invalida.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa '${this.tipo_funcion.toString()}' solamente acepta expresiones numericos.`, this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `La variable con ID ${this.expresion}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.Matematicas = Matematicas;
