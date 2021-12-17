"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logica = void 0;
const Nodo_1 = require("../../Ast/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Errores_1 = require("../../Ast/Errores");
const Retorno_1 = require("../../G3D/Retorno");
class Logica {
    constructor(exp1, operador, exp2, fila, columna, expU) {
        this.exp1 = exp1;
        this.operador = operador;
        this.exp2 = exp2;
        this.fila = fila;
        this.columna = columna;
        this.expU = expU;
        this.tipo = null;
        this.lblFalse = '';
        this.lblTrue = '';
    }
    limpiar() {
        this.lblFalse = '';
        this.lblTrue = '';
        if (this.expU == false) {
            this.exp1.limpiar();
            this.exp2.limpiar();
        }
        else {
            this.exp1.limpiar();
        }
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
         * de las operaciones Logicas permitidas que soporta el lenguaje descrito en el enunciado.
         */
        switch (this.operador) {
            case Tipo_1.OperadorLogico.AND:
                if (typeof valor_exp1 == 'boolean') {
                    if (typeof valor_exp2 == 'boolean') {
                        this.tipo = Tipo_1.TIPO.BOOLEANO;
                        return valor_exp1 && valor_exp2;
                    }
                    else {
                        // ERROR SEMANTICO
                        return new Errores_1.Errores("Semantico", "Logica -AND- Los tipos no coinciden ", this.fila, this.columna);
                    }
                }
                break;
            case Tipo_1.OperadorLogico.OR:
                if (typeof valor_exp1 == 'boolean') {
                    if (typeof valor_exp2 == 'boolean') {
                        this.tipo = Tipo_1.TIPO.BOOLEANO;
                        return valor_exp1 || valor_exp2;
                    }
                    else {
                        return new Errores_1.Errores("Semantico", "Logica -OR- Los tipos no coinciden ", this.fila, this.columna);
                    }
                }
                break;
            case Tipo_1.OperadorLogico.NOT:
                if (typeof valor_expU == 'boolean') {
                    this.tipo = Tipo_1.TIPO.BOOLEANO;
                    return !valor_expU;
                }
                else {
                    return new Errores_1.Errores("Semantico", "Logica -NOT- El tipo no coincide ", this.fila, this.columna);
                }
            default:
                break;
        }
    }
    translate3d(table, tree) {
        switch (this.operador) {
            case Tipo_1.OperadorLogico.AND:
                return this.and3D(table, tree);
            case Tipo_1.OperadorLogico.NOT:
                break;
            case Tipo_1.OperadorLogico.OR:
                return this.or3D(table, tree);
            default:
                break;
        }
    }
    and3D(table, tree) {
        const gen3d = tree.generadorC3d;
        this.lblTrue = this.lblTrue == '' ? gen3d.newLabel() : this.lblTrue;
        this.lblFalse = this.lblFalse == '' ? gen3d.newLabel() : this.lblFalse;
        console.log(this.exp1.lblTrue);
        console.log(this.exp1.lblFalse);
        this.exp1.lblTrue = gen3d.newLabel();
        this.exp2.lblTrue = this.lblTrue;
        this.exp1.lblFalse = this.exp2.lblFalse = this.lblFalse;
        const expIzq = this.exp1.translate3d(table, tree);
        gen3d.gen_Label(this.exp1.lblTrue);
        const expDer = this.exp2.translate3d(table, tree);
        if (expIzq == Tipo_1.TIPO.BOOLEANO && expDer == Tipo_1.TIPO.BOOLEANO) {
            const retorno = new Retorno_1.Retorno('', false, Tipo_1.TIPO.BOOLEANO);
            retorno.lblTrue = this.lblTrue;
            retorno.lblFalse = this.exp2.lblFalse;
            return retorno;
        }
    }
    or3D(table, tree) {
        const gen3d = tree.generadorC3d;
        this.lblTrue = this.lblTrue == '' ? gen3d.newLabel() : this.lblTrue;
        this.lblFalse = this.lblFalse == '' ? gen3d.newLabel() : this.lblFalse;
        this.exp1.lblTrue = this.exp2.lblTrue = this.lblTrue;
        this.exp1.lblFalse = gen3d.newLabel();
        this.exp2.lblFalse = this.lblFalse;
        const expIzq = this.exp1.translate3d(table, tree);
        gen3d.gen_Label(this.exp1.lblFalse);
        const expDer = this.exp2.translate3d(table, tree);
        if (expIzq == Tipo_1.TIPO.BOOLEANO && expDer == Tipo_1.TIPO.BOOLEANO) {
            const retorno = new Retorno_1.Retorno('', false, Tipo_1.TIPO.BOOLEANO);
            retorno.lblTrue = this.lblTrue;
            retorno.lblFalse = this.exp2.lblFalse;
            return retorno;
        }
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
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("EXP LOGICAS", "");
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
exports.Logica = Logica;
