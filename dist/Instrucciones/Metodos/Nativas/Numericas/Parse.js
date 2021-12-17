"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parse = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Tipo_1 = require("../../../../TablaSimbolos/Tipo");
const Nodo_1 = require("../../../../Ast/Nodo");
class Parse {
    constructor(tipo_funcion, parameters, fila, columna) {
        this.tipo_funcion = tipo_funcion;
        this.parameters = parameters;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // console.log("parse params: " + this.parameters);
        let cadena = this.parameters.ejecutar(table, tree);
        // console.log("parse cadena: " + this.parameters.tipo);
        if (cadena != null) {
            if (this.parameters.tipo == Tipo_1.TIPO.CADENA) {
                this.tipo = this.tipo_funcion;
                switch (this.tipo_funcion) {
                    case Tipo_1.TIPO.ENTERO:
                        try {
                            return parseInt(cadena);
                        }
                        catch (error) {
                            return new Errores_1.Errores("Semantico", `No fue posible castear a entero el valor '${cadena.toString()}'.`, this.fila, this.columna);
                        }
                    case Tipo_1.TIPO.DECIMAL:
                        try {
                            return parseFloat(cadena);
                        }
                        catch (error) {
                            return new Errores_1.Errores("Semantico", `No fue posible castear a double el valor '${cadena.toString()}'.`, this.fila, this.columna);
                        }
                    case Tipo_1.TIPO.BOOLEANO:
                        try {
                            if (cadena == "1" || cadena.toUpperCase() == "true".toUpperCase()) {
                                return true;
                            }
                            else if (cadena == "0" || cadena.toUpperCase() == "false".toUpperCase()) {
                                return false;
                            }
                            else {
                                return new Errores_1.Errores("Semantico", `Valor: '${cadena.toString()}', invalido para parsear a booleano.`, this.fila, this.columna);
                            }
                        }
                        catch (error) {
                            return new Errores_1.Errores("Semantico", `No fue posible castear a booleano el valor '${cadena.toString()}'.`, this.fila, this.columna);
                        }
                    default:
                        return new Errores_1.Errores("Semantico", `No fue posible castear el valor '${cadena.toString()}'.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa 'PARSE' no puede utilizarse, porque '${cadena.toString()}' no es una cadena.`, this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `La variable con ID ${this.id}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented PARSE.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("Parse", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        padre.addChildNode(this.parameters.recorrer(table, tree));
        return padre;
    }
}
exports.Parse = Parse;
