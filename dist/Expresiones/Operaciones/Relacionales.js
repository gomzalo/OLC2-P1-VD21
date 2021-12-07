"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Tipo_2 = require("../../TablaSimbolos/Tipo");
class Relacional {
    constructor(exp1, operador, exp2, fila, columna, expU) {
        this.exp1 = exp1;
        this.operador = operador;
        this.exp2 = exp2;
        this.fila = fila;
        this.columna = columna;
        this.expU = expU;
    }
    getTipo(table, tree) {
        let valor = this.getValorImplicito(table, tree);
        if (typeof valor === 'number') {
            return Tipo_2.TIPO.DECIMAL;
        }
        else if (typeof valor === 'string') {
            return Tipo_2.TIPO.CADENA;
        }
        else if (typeof valor === 'boolean') {
            return Tipo_2.TIPO.BOOLEANO;
        }
    }
    getValorImplicito(table, tree) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        if (this.expU == false) {
            valor_exp1 = this.exp1.getValorImplicito(table, tree);
            valor_exp2 = this.exp2.getValorImplicito(table, tree);
        }
        else {
            valor_expU = this.exp1.getValorImplicito(table, tree);
        }
        /**
         * Para las siguientes validaciones nos basamos en la tabla de
         * de las operaciones relacionales permitidas que soporta el lenguaje descrito en el enunciado.
         */
        switch (this.operador) {
            case Tipo_1.OperadorRelacional.MENORQUE:
                if (typeof valor_exp1 === 'number') {
                    if (typeof valor_exp2 === 'number') {
                        return valor_exp1 < valor_exp2;
                    }
                    else if (typeof valor_exp2 == 'string') {
                        if (valor_exp2.length == 1) {
                            let num_ascii = valor_exp2.charCodeAt(0);
                            return valor_exp1 < num_ascii;
                        }
                        else {
                            // TODO: agregar error
                        }
                    } //TODO: agregar los otros casos de errores
                }
                else if (typeof valor_exp1 === 'string') {
                    let num_ascii = valor_exp1.charCodeAt(0);
                    if (typeof valor_exp2 === 'number') {
                        return num_ascii < valor_exp2;
                    }
                    else if (typeof valor_exp2 == 'string') {
                        if (valor_exp2.length == 1) {
                            let num_ascii2 = valor_exp2.charCodeAt(0);
                            return num_ascii < num_ascii2;
                        }
                        else {
                            // TODO: agregar error
                        }
                    } //TODO: agregar los otros casos de errores
                }
                break;
            case Tipo_1.OperadorRelacional.MAYORQUE:
                if (typeof valor_exp1 === 'number') {
                    if (typeof valor_exp2 === 'number') {
                        return valor_exp1 > valor_exp2;
                    }
                    else if (typeof valor_exp2 == 'string') {
                        if (valor_exp2.length == 1) {
                            let num_ascii = valor_exp2.charCodeAt(0);
                            return valor_exp1 > num_ascii;
                        }
                        else {
                            // TODO: agregar error
                        }
                    } //TODO: agregar los otros casos de errores
                }
                break;
            case Tipo_1.OperadorRelacional.IGUALIGUAL:
                if (typeof valor_exp1 === 'number') {
                    if (typeof valor_exp2 === 'number') {
                        return valor_exp1 == valor_exp2;
                    }
                }
                break;
            case Tipo_1.OperadorRelacional.MAYORIGUAL:
                if (typeof valor_exp1 === 'number') {
                    if (typeof valor_exp2 === 'number') {
                        return valor_exp1 >= valor_exp2;
                    }
                }
                break;
            // TODO: Agregar mas casos de relacionales (IGUALIGUAL, DIFERENCIA, MAYORIGUAL, MENORIGUAL)
            default:
                break;
        }
    }
}
exports.default = Relacional;