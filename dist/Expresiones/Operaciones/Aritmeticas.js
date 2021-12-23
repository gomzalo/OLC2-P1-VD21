"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aritmetica = void 0;
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Retorno_1 = require("../../G3D/Retorno");
class Aritmetica {
    constructor(exp1, operador, exp2, fila, columna, expU) {
        this.exp1 = exp1;
        this.operador = operador;
        this.exp2 = exp2;
        this.fila = fila;
        this.columna = columna;
        this.expU = expU;
        this.tipo = null;
    }
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //      :::::::::::::::::::::    EJECUTAR      :::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
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
         * de las operaciones aritmeticas permitidas que soporta el lenguaje descrito en el enunciado.
         */
        switch (this.operador) {
            case Tipo_1.OperadorAritmetico.MAS:
                if (tipoGeneral == Tipo_1.TIPO.CADENA) {
                    // this.tipo = TIPO.CADENA;
                    // return valor_exp1.toString() + valor_exp2.toString();
                    return new Errores_1.Errores("Semantico", "Suma - Error de tipos STRING, no concatenable", this.fila, this.columna);
                }
                else if (tipoGeneral == Tipo_1.TIPO.BOOLEANO) {
                    return new Errores_1.Errores("Semantico", "Suma - Error de tipo booleano", this.fila, this.columna);
                }
                else if (tipoGeneral == Tipo_1.TIPO.CHARACTER) {
                    if (this.exp1.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 + valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) + valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1 + valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1.charCodeAt(0) + valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER && this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) + valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 + valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) + valor_exp2;
                    }
                    else {
                        return new Errores_1.Errores("Semantico", "Suma - Error de tipo ", this.fila, this.columna);
                    }
                }
                else if (tipoGeneral == Tipo_1.TIPO.DECIMAL) {
                    this.tipo = Tipo_1.TIPO.DECIMAL;
                    return valor_exp1 + valor_exp2;
                }
                else if (tipoGeneral == Tipo_1.TIPO.ENTERO) {
                    this.tipo = Tipo_1.TIPO.ENTERO;
                    return valor_exp1 + valor_exp2;
                }
                else {
                    return new Errores_1.Errores("Semantico", "Suma - Error de tipo ", this.fila, this.columna);
                }
                break;
            case Tipo_1.OperadorAritmetico.UMENOS:
                if (this.exp1.tipo == Tipo_1.TIPO.ENTERO || this.exp1.tipo == Tipo_1.TIPO.DECIMAL) {
                    this.tipo = this.exp1.tipo;
                    return -valor_expU;
                }
                else {
                    return new Errores_1.Errores("Semantico", "UNARIO - Error de tipo ", this.fila, this.columna);
                }
                break;
            case Tipo_1.OperadorAritmetico.MENOS:
                if (tipoGeneral == Tipo_1.TIPO.CHARACTER) {
                    if (this.exp1.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 - valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) - valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1 - valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1.charCodeAt(0) - valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER && this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) - valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 - valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) - valor_exp2;
                    }
                    else {
                        return new Errores_1.Errores("Semantico", "Resta - Error de tipo ", this.fila, this.columna);
                    }
                }
                else if (tipoGeneral == Tipo_1.TIPO.DECIMAL) {
                    this.tipo = Tipo_1.TIPO.DECIMAL;
                    return valor_exp1 - valor_exp2;
                }
                else if (tipoGeneral == Tipo_1.TIPO.ENTERO) {
                    this.tipo = Tipo_1.TIPO.ENTERO;
                    return valor_exp1 - valor_exp2;
                }
                else {
                    return new Errores_1.Errores("Semantico", "Resta - Error de tipo ", this.fila, this.columna);
                }
                break;
            case Tipo_1.OperadorAritmetico.POR:
                if (tipoGeneral == Tipo_1.TIPO.CHARACTER) {
                    if (this.exp1.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 * valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) * valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1 * valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1.charCodeAt(0) * valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER && this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) * valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 * valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) * valor_exp2;
                    }
                    else {
                        return new Errores_1.Errores("Semantico", "POR - Error de tipo ", this.fila, this.columna);
                    }
                }
                else if (tipoGeneral == Tipo_1.TIPO.DECIMAL) {
                    this.tipo = Tipo_1.TIPO.DECIMAL;
                    return valor_exp1 * valor_exp2;
                }
                else if (tipoGeneral == Tipo_1.TIPO.ENTERO) {
                    this.tipo = Tipo_1.TIPO.ENTERO;
                    return valor_exp1 * valor_exp2;
                }
                else {
                    return new Errores_1.Errores("Semantico", "POR - Error de tipo ", this.fila, this.columna);
                }
                break;
            case Tipo_1.OperadorAritmetico.DIV:
                if (tipoGeneral == Tipo_1.TIPO.CHARACTER) {
                    if (this.exp1.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 / valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) / valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1 / valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1.charCodeAt(0) / valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER && this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) / valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 / valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) / valor_exp2;
                    }
                    else {
                        return new Errores_1.Errores("Semantico", "DIV - Error de tipo ", this.fila, this.columna);
                    }
                }
                else if (tipoGeneral == Tipo_1.TIPO.DECIMAL) {
                    this.tipo = Tipo_1.TIPO.DECIMAL;
                    return valor_exp1 / valor_exp2;
                }
                else if (tipoGeneral == Tipo_1.TIPO.ENTERO) {
                    this.tipo = Tipo_1.TIPO.ENTERO;
                    return valor_exp1 / valor_exp2;
                }
                else {
                    return new Errores_1.Errores("Semantico", "DIV - Error de tipo ", this.fila, this.columna);
                }
                break;
            case Tipo_1.OperadorAritmetico.MOD:
                if (tipoGeneral == Tipo_1.TIPO.CHARACTER) {
                    if (this.exp1.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 % valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) % valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1 % valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1.charCodeAt(0) % valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER && this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) % valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 % valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) % valor_exp2;
                    }
                    else {
                        return new Errores_1.Errores("Semantico", "MOD - Error de tipo ", this.fila, this.columna);
                    }
                }
                else if (tipoGeneral == Tipo_1.TIPO.DECIMAL) {
                    this.tipo = Tipo_1.TIPO.DECIMAL;
                    return valor_exp1 % valor_exp2;
                }
                else if (tipoGeneral == Tipo_1.TIPO.ENTERO) {
                    this.tipo = Tipo_1.TIPO.ENTERO;
                    return valor_exp1 % valor_exp2;
                }
                else {
                    return new Errores_1.Errores("Semantico", "MOD - Error de tipo ", this.fila, this.columna);
                }
                break;
            case Tipo_1.OperadorAritmetico.POT:
                if (this.exp1.tipo == Tipo_1.TIPO.CADENA && this.exp2.tipo == Tipo_1.TIPO.ENTERO) {
                    this.tipo = Tipo_1.TIPO.CADENA;
                    return valor_exp1.toString().repeat(valor_exp2);
                }
                else {
                    return new Errores_1.Errores("Semantico", "POTENCIA - Error de tipo ", this.fila, this.columna);
                }
                break;
            case Tipo_1.OperadorAritmetico.AMPERSON:
                // if (this.exp1.tipo == TIPO.CADENA && this.exp2.tipo == TIPO.CADENA ){
                this.tipo = Tipo_1.TIPO.CADENA;
                return valor_exp1.toString() + valor_exp2.toString();
                // }else{
                // return new Errores("Semantico", "Concatenacion - Error de tipo ", this.fila, this.columna);
                // }
                // if(typeof valor_exp1 === 'number'){
                //     if(typeof valor_exp2 === 'number'){
                //         return Math.pow(valor_exp1, valor_exp2);
                //     }
                // }
                break;
            //TODO: Agregar otros casos de aritmeticas (POTENCIA, MODULO)
            default:
                //TODO: agregar errror que ser produjo algo inesperado.
                break;
        }
    }
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //      :::::::::::::::::::::    C3D      :::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    translate3d(table, tree) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        if (this.expU == false) {
            valor_exp1 = this.exp1.translate3d(table, tree);
            valor_exp2 = this.exp2.translate3d(table, tree);
        }
        else {
            valor_expU = this.exp1.translate3d(table, tree);
        }
        switch (this.operador) {
            case Tipo_1.OperadorAritmetico.MAS:
                // console.log("entre a suma");
                return this.suma3D(valor_exp1, valor_exp2, table, tree);
            case Tipo_1.OperadorAritmetico.MENOS:
                return this.resta3D(valor_exp1, valor_exp2, table, tree);
            case Tipo_1.OperadorAritmetico.POR:
                return this.multiplicacion3D(valor_exp1, valor_exp2, table, tree);
            case Tipo_1.OperadorAritmetico.DIV:
                return this.divicion3D(valor_exp1, valor_exp2, table, tree);
            case Tipo_1.OperadorAritmetico.POT:
                return this.potencia(valor_exp1, valor_exp2, table, tree);
            case Tipo_1.OperadorAritmetico.MOD:
                return this.modulo3D(valor_exp1, valor_exp2, table, tree);
            case Tipo_1.OperadorAritmetico.UMENOS:
                return this.unario3D(valor_expU, table, tree);
            case Tipo_1.OperadorAritmetico.AMPERSON:
                return this.suma3D(valor_exp1, valor_exp2, table, tree);
            default:
                //Se produjo un error inesperado
                break;
        }
    }
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // :::::::::::::::::::::    Aritmeticas C3D      :::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    suma3D(valor_exp1, valor_exp2, table, tree) {
        const genc3d = tree.generadorC3d;
        const temp = genc3d.newTemp();
        let tempAux;
        switch (valor_exp1.tipo) {
            case Tipo_1.TIPO.DECIMAL:
                switch (valor_exp2.tipo) {
                    case Tipo_1.TIPO.DECIMAL:
                        genc3d.gen_Exp(temp, valor_exp1.translate3d(), valor_exp2.translate3d(), '+');
                        return new Retorno_1.Retorno(temp, true, valor_exp2.tipo, null, table, tree);
                    case Tipo_1.TIPO.ENTERO:
                        genc3d.gen_Exp(temp, valor_exp1.translate3d(), valor_exp2.translate3d(), '+');
                        return new Retorno_1.Retorno(temp, true, valor_exp2.tipo, null, table, tree);
                    case Tipo_1.TIPO.CADENA:
                        let tempAux = genc3d.newTemp();
                        genc3d.freeTemp(tempAux);
                        genc3d.gen_Exp(tempAux, 'p', 1 + 1, '+');
                        genc3d.gen_SetStack(tempAux, valor_exp1.translate3d());
                        genc3d.gen_Exp(tempAux, tempAux, '1', '+');
                        genc3d.gen_SetStack(tempAux, valor_exp2.translate3d());
                        genc3d.gen_NextEnv(1);
                        genc3d.gen_Call('natConcatInt_str');
                        genc3d.gen_GetStack(temp, 'p');
                        genc3d.gen_AntEnv(1);
                        return new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.CADENA, null, table, tree);
                    case Tipo_1.TIPO.BOOLEANO:
                    default:
                        break;
                }
                break;
            case Tipo_1.TIPO.ENTERO:
                switch (valor_exp2.tipo) {
                    case Tipo_1.TIPO.DECIMAL:
                        genc3d.gen_Exp(temp, valor_exp1.translate3d(), valor_exp2.translate3d(), '+');
                        return new Retorno_1.Retorno(temp, true, valor_exp2.tipo, null, table, tree);
                    case Tipo_1.TIPO.ENTERO:
                        genc3d.gen_Exp(temp, valor_exp1.translate3d(), valor_exp2.translate3d(), '+');
                        return new Retorno_1.Retorno(temp, true, valor_exp2.tipo, null, table, tree);
                    case Tipo_1.TIPO.CADENA:
                        let tempAux = genc3d.newTemp();
                        genc3d.freeTemp(tempAux);
                        genc3d.gen_Exp(tempAux, 'p', 1 + 1, '+');
                        genc3d.gen_SetStack(tempAux, valor_exp1.translate3d());
                        genc3d.gen_Exp(tempAux, tempAux, '1', '+');
                        genc3d.gen_SetStack(tempAux, valor_exp2.translate3d());
                        genc3d.gen_NextEnv(1);
                        genc3d.gen_Call('natConcatInt_str');
                        genc3d.gen_GetStack(temp, 'p');
                        genc3d.gen_AntEnv(1);
                        return new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.CADENA, null, table, tree);
                    case Tipo_1.TIPO.BOOLEANO:
                    default:
                        break;
                }
                break;
            case Tipo_1.TIPO.CADENA:
                switch (valor_exp2.tipo) {
                    case Tipo_1.TIPO.DECIMAL:
                        tempAux = genc3d.newTemp();
                        genc3d.freeTemp(tempAux);
                        genc3d.gen_Exp(tempAux, 'p', 1 + 1, '+');
                        genc3d.gen_SetStack(tempAux, valor_exp1.translate3d());
                        genc3d.gen_Exp(tempAux, tempAux, '1', '+');
                        genc3d.gen_SetStack(tempAux, valor_exp2.translate3d());
                        genc3d.gen_NextEnv(1);
                        genc3d.gen_Call('natConcatStr_int');
                        genc3d.gen_GetStack(temp, 'p');
                        genc3d.gen_AntEnv(1);
                        return new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.CADENA, null, table, tree);
                    case Tipo_1.TIPO.ENTERO:
                        tempAux = genc3d.newTemp();
                        genc3d.freeTemp(tempAux);
                        genc3d.gen_Exp(tempAux, 'p', 1 + 1, '+');
                        genc3d.gen_SetStack(tempAux, valor_exp1.translate3d());
                        genc3d.gen_Exp(tempAux, tempAux, '1', '+');
                        genc3d.gen_SetStack(tempAux, valor_exp2.translate3d());
                        genc3d.gen_NextEnv(1);
                        genc3d.gen_Call('natConcatInt_str');
                        genc3d.gen_GetStack(temp, 'p');
                        genc3d.gen_AntEnv(1);
                        return new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.CADENA, null, table, tree);
                    case Tipo_1.TIPO.CADENA:
                        tempAux = genc3d.newTemp();
                        genc3d.freeTemp(tempAux);
                        genc3d.gen_Exp(tempAux, 'p', 1 + 1, '+');
                        genc3d.gen_SetStack(tempAux, valor_exp1.translate3d());
                        genc3d.gen_Exp(tempAux, tempAux, '1', '+');
                        genc3d.gen_SetStack(tempAux, valor_exp2.translate3d());
                        genc3d.gen_NextEnv(1);
                        genc3d.gen_Call('natConcatStr');
                        genc3d.gen_GetStack(temp, 'p');
                        genc3d.gen_AntEnv(1);
                        return new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.CADENA, null, table, tree);
                    case Tipo_1.TIPO.BOOLEANO:
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    }
    potencia(valor_exp1, valor_exp2, table, tree) {
        if (typeof valor_exp1 == 'number') {
            if (typeof valor_exp2 == 'number') {
                return Math.pow(valor_exp1, valor_exp2);
            }
            else if (typeof valor_exp2 == 'boolean') {
                //Error semantico
            }
            else if (typeof valor_exp2 == 'string') {
                //Erroro semantico
            }
        }
        else if (typeof valor_exp1 == 'boolean') {
            //Erro semantico
        }
        else if (typeof valor_exp1 == 'string') {
            // Error semantico
        }
    }
    resta3D(valor_exp1, valor_exp2, table, tree) {
        const genc3d = tree.generadorC3d;
        const temp = genc3d.newTemp();
        if (valor_exp1.tipo == Tipo_1.TIPO.DECIMAL || valor_exp1.tipo == Tipo_1.TIPO.ENTERO) {
            if (valor_exp2.tipo == Tipo_1.TIPO.DECIMAL || valor_exp2.tipo == Tipo_1.TIPO.ENTERO) {
                genc3d.gen_Exp(temp, valor_exp1.translate3d(), valor_exp2.translate3d(), '-');
                return new Retorno_1.Retorno(temp, true, valor_exp2.tipo, null, table, tree);
            }
        }
    }
    multiplicacion3D(valor_exp1, valor_exp2, table, tree) {
        const genc3d = tree.generadorC3d;
        const temp = genc3d.newTemp();
        if (valor_exp1.tipo == Tipo_1.TIPO.DECIMAL || valor_exp1.tipo == Tipo_1.TIPO.ENTERO) {
            if (valor_exp2.tipo == Tipo_1.TIPO.DECIMAL || valor_exp2.tipo == Tipo_1.TIPO.ENTERO) {
                genc3d.gen_Exp(temp, valor_exp1.translate3d(), valor_exp2.translate3d(), '*');
                return new Retorno_1.Retorno(temp, true, valor_exp2.tipo, null, table, tree);
            }
        }
    }
    divicion3D(valor_exp1, valor_exp2, table, tree) {
        const genc3d = tree.generadorC3d;
        const temp = genc3d.newTemp();
        if (valor_exp1.tipo == Tipo_1.TIPO.DECIMAL || valor_exp1.tipo == Tipo_1.TIPO.ENTERO) {
            if (valor_exp2.tipo == Tipo_1.TIPO.DECIMAL || valor_exp2.tipo == Tipo_1.TIPO.ENTERO) {
                genc3d.gen_Exp(temp, valor_exp1.translate3d(), valor_exp2.translate3d(), '/');
                return new Retorno_1.Retorno(temp, true, valor_exp2.tipo, null, table, tree);
            }
        }
    }
    modulo3D(valor_exp1, valor_exp2, table, tree) {
        const genc3d = tree.generadorC3d;
        const temp = genc3d.newTemp();
        if (valor_exp1.tipo == Tipo_1.TIPO.DECIMAL || valor_exp1.tipo == Tipo_1.TIPO.ENTERO) {
            if (valor_exp2.tipo == Tipo_1.TIPO.DECIMAL || valor_exp2.tipo == Tipo_1.TIPO.ENTERO) {
                genc3d.gen_Code(temp + ' = fmod(' + valor_exp1.translate3d() + ',' + valor_exp2.translate3d() + ');');
                return new Retorno_1.Retorno(temp, true, valor_exp2.tipo, null, table, tree);
            }
        }
    }
    unario3D(valor_exp1, table, tree) {
        const genc3d = tree.generadorC3d;
        const temp = genc3d.newTemp();
        if (valor_exp1.tipo == Tipo_1.TIPO.DECIMAL || valor_exp1.tipo == Tipo_1.TIPO.ENTERO) {
            genc3d.gen_Exp(temp, valor_exp1.translate3d(), '-1', '*');
            return new Retorno_1.Retorno(temp, true, valor_exp1.tipo, null, table, tree);
        }
    }
    getTipo(ts, table, ast) {
        let valor = this.ejecutar(ts, ast);
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
        let padre = new Nodo_1.Nodo("ARITMETICAS", "");
        if (this.expU) {
            padre.addChildNode(new Nodo_1.Nodo(this.operador.toString(), ""));
            padre.addChildNode(this.exp1.recorrer());
        }
        else {
            padre.addChildNode(this.exp1.recorrer());
            padre.addChildNode(new Nodo_1.Nodo(this.operador.toString(), ""));
            padre.addChildNode(this.exp2.recorrer());
        }
        return padre;
    }
}
exports.Aritmetica = Aritmetica;
