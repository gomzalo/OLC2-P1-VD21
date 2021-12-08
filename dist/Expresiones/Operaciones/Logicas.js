"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logica = void 0;
const Nodo_1 = __importDefault(require("../../Ast/Nodo"));
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Errores_1 = __importDefault(require("../../Ast/Errores"));
class Logica {
    constructor(exp1, operador, exp2, fila, columna, expU) {
        this.exp1 = exp1;
        this.operador = operador;
        this.exp2 = exp2;
        this.fila = fila;
        this.columna = columna;
        this.expU = expU;
    }
    ejecutar(table, tree) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        if (this.expU == false) {
            valor_exp1 = this.exp1.ejecutar(table, tree);
            valor_exp2 = this.exp2.ejecutar(table, tree);
        }
        else {
            valor_expU = this.exp1.ejecutar(table, tree);
        }
        /**
         * Para las siguientes validaciones nos basamos en la tabla de
         * de las operaciones Logicas permitidas que soporta el lenguaje descrito en el enunciado.
         */
        switch (this.operador) {
            case Tipo_1.OperadorLogico.AND:
                if (typeof valor_exp1 == 'boolean') {
                    if (typeof valor_exp2 == 'boolean') {
                        return valor_exp1 && valor_exp2;
                    }
                    else {
                        // ERROR SEMANTICO
                        return new Errores_1.default("Semantico", "Logica -AND- Los tipos no coinciden ", this.fila, this.columna);
                    }
                }
                break;
            case Tipo_1.OperadorLogico.OR:
                if (typeof valor_exp1 == 'boolean') {
                    if (typeof valor_exp2 == 'boolean') {
                        return valor_exp1 || valor_exp2;
                    }
                    else {
                        // ERROR SEMANTICO
                        return new Errores_1.default("Semantico", "Logica -OR- Los tipos no coinciden ", this.fila, this.columna);
                    }
                }
                break;
            case Tipo_1.OperadorLogico.NOT:
                if (typeof valor_expU == 'boolean') {
                    return !valor_expU;
                }
                else {
                    //TODO: Error
                    return new Errores_1.default("Semantico", "Logica -NOT- El tipo no coincide ", this.fila, this.columna);
                }
            // TODO: Agregar caso para logica OR. 
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
exports.Logica = Logica;
