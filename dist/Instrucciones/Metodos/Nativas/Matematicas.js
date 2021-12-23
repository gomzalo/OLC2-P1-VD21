"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matematicas = void 0;
const Identificador_1 = require("./../../../Expresiones/Identificador");
const Errores_1 = require("../../../Ast/Errores");
const Nodo_1 = require("../../../Ast/Nodo");
class Matematicas {
    /**
     * @Matematicas Funciones trigonometricas y demas.
     * @param tipo_funcion sqrt | sin | cos | tan
     * @param expresion Parametro a evaluar.
     * @param fila
     * @param columna
     */
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
                // console.log("es id");
                valor = expresion;
            }
            else {
                valor = this.expresion.valor;
            }
            if (!isNaN(valor)) {
                this.tipo = this.expresion.tipo;
                switch (this.tipo_funcion.toString()) {
                    case "sin":
                        return Math.sin(valor * Math.PI / 180);
                    case "cos":
                        return Math.cos(valor * Math.PI / 180);
                    case "tan":
                        return Math.tan(valor * Math.PI / 180);
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
        let padre = new Nodo_1.Nodo("Matematicas", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, "")); //this.tipo_funcion.toString()
        let tipoN = new Nodo_1.Nodo("TIPO_FUNCION", "");
        tipoN.addChildNode(new Nodo_1.Nodo(this.tipo_funcion.toString(), ""));
        let instruccion = new Nodo_1.Nodo("INSTRUCCION", "");
        instruccion.addChildNode(this.expresion.recorrer(table, tree));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        padre.addChildNode(tipoN);
        padre.addChildNode(instruccion);
        return padre;
    }
}
exports.Matematicas = Matematicas;
