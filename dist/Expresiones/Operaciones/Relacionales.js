"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relacional = void 0;
const Nodo_1 = require("../../Ast/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Errores_1 = require("../../Ast/Errores");
class Relacional {
    constructor(exp1, operador, exp2, fila, columna, expU) {
        this.exp1 = exp1;
        this.operador = operador;
        this.exp2 = exp2;
        this.fila = fila;
        this.columna = columna;
        this.expU = expU;
        this.tipo = Tipo_1.TIPO.BOOLEANO;
    }
    ejecutar(table, tree) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        let tipoGeneral;
        if (this.expU == false) {
            valor_exp1 = this.exp1.ejecutar(table, tree);
            valor_exp2 = this.exp2.ejecutar(table, tree);
            tipoGeneral = this.getTipoMax(this.exp1.tipo, this.exp2.tipo);
        }
        else {
            valor_expU = this.exp1.ejecutar(table, tree);
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
                            return new Errores_1.Errores("Semantico", "Relacional -MENORQUE- Error de tipos no coinciden ", this.fila, this.columna);
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
                            return new Errores_1.Errores("Semantico", "Relacional -MENORQUE- Error de tipos no coinciden ", this.fila, this.columna);
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
                            return new Errores_1.Errores("Semantico", "Relacional -MAYORQUE- Error de tipos no coinciden ", this.fila, this.columna);
                        }
                    }
                }
                else if (typeof valor_exp1 === 'string') {
                    let num_ascii = valor_exp1.charCodeAt(0);
                    if (typeof valor_exp2 === 'number') {
                        return num_ascii > valor_exp2;
                    }
                    else if (typeof valor_exp2 == 'string') {
                        if (valor_exp2.length == 1) {
                            let num_ascii2 = valor_exp2.charCodeAt(0);
                            return num_ascii > num_ascii2;
                        }
                        else {
                            // TODO: agregar error
                            return new Errores_1.Errores("Semantico", "Relacional -MAYORQUE- Error de tipos no coinciden ", this.fila, this.columna);
                        }
                    } //TODO: agregar los otros casos de errores
                }
                else {
                    //error semantico
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
            case Tipo_1.OperadorRelacional.MENORIGUAL:
                if (typeof valor_exp1 === 'number') {
                    if (typeof valor_exp2 === 'number') {
                        return valor_exp1 <= valor_exp2;
                    }
                }
                break;
            default:
                break;
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    getTipo(table, tree) {
        let valor = this.ejecutar(table, tree);
        if (typeof valor === 'number') {
            return Tipo_1.TIPO.DECIMAL;
        }
        else if (typeof valor === 'string') {
            return Tipo_1.TIPO.CADENA;
        }
        else if (typeof valor === 'boolean') {
            return Tipo_1.TIPO.BOOLEANO;
        }
    }
    getTipoMax(tipoIzq, tipoDer) {
        if (tipoIzq == Tipo_1.TIPO.NULO || tipoDer == Tipo_1.TIPO.NULO) {
            return Tipo_1.TIPO.NULO;
        }
        if (tipoIzq == Tipo_1.TIPO.CADENA || tipoDer == Tipo_1.TIPO.CADENA) {
            return Tipo_1.TIPO.CADENA;
        }
        if (tipoIzq == Tipo_1.TIPO.CHARACTER || tipoDer == Tipo_1.TIPO.CHARACTER) {
            return Tipo_1.TIPO.CADENA;
        }
        if (tipoIzq == Tipo_1.TIPO.BOOLEANO || tipoDer == Tipo_1.TIPO.BOOLEANO) {
            return Tipo_1.TIPO.BOOLEANO;
        }
        if (tipoIzq == Tipo_1.TIPO.DECIMAL || tipoDer == Tipo_1.TIPO.DECIMAL) {
            return Tipo_1.TIPO.DECIMAL;
        }
        if (tipoIzq == Tipo_1.TIPO.ENTERO || tipoDer == Tipo_1.TIPO.ENTERO) {
            return Tipo_1.TIPO.ENTERO;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Exp. Relacional", "");
        if (this.expU) {
            padre.addChildNode(new Nodo_1.Nodo(this.operador, ""));
            padre.addChildNode(this.exp1.recorrer());
        }
        else {
            padre.addChildNode(this.exp1.recorrer());
            padre.addChildNode(new Nodo_1.Nodo(this.operador, ""));
            padre.addChildNode(this.exp2.recorrer());
        }
        return padre;
    }
}
exports.Relacional = Relacional;
