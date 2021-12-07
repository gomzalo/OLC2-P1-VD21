"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = __importDefault(require("../../Ast/Nodo"));
const TIPO = require("../../TablaSimbolos/Tipo/TIPO");
const OperadorLogico = require("../../TablaSimbolos/Tipo/OperadorLogico");
class Logica {
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
            return TIPO.DECIMAL;
        }
        else if (typeof valor === 'string') {
            return TIPO.CADENA;
        }
        else if (typeof valor === 'boolean') {
            return TIPO.BOOLEANO;
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
         * de las operaciones Logicas permitidas que soporta el lenguaje descrito en el enunciado.
         */
        switch (this.operador) {
            case OperadorLogico.AND:
                if (typeof valor_exp1 == 'boolean') {
                    if (typeof valor_exp2 == 'boolean') {
                        return valor_exp1 && valor_exp2;
                    }
                    else {
                        // ERROR SEMANTICO
                    }
                }
                break;
            case OperadorLogico.OR:
                if (typeof valor_exp1 == 'boolean') {
                    if (typeof valor_exp2 == 'boolean') {
                        return valor_exp1 || valor_exp2;
                    }
                    else {
                        // ERROR SEMANTICO
                    }
                }
                break;
            case OperadorLogico.NOT:
                if (typeof valor_expU == 'boolean') {
                    return !valor_expU;
                }
                else {
                    //TODO: Error
                }
            // TODO: Agregar caso para logica OR. 
            default:
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.default("Exp. Logica", "");
        if (this.expU) {
            padre.addChildNode(new Nodo_1.default(this.operador, ""));
            padre.addChildNode(this.exp1.recorrer());
        }
        else {
            padre.addChildNode(this.exp1.recorrer());
            padre.addChildNode(new Nodo_1.default(this.operador, ""));
            padre.addChildNode(this.exp2.recorrer());
        }
        return padre;
    }
}
exports.default = Logica;
