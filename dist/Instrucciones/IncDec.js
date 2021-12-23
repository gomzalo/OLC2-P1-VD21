"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncDec = void 0;
const Identificador_1 = require("./../Expresiones/Identificador");
const Errores_1 = require("../Ast/Errores");
const Nodo_1 = require("../Ast/Nodo");
const Retorno_1 = require("../G3D/Retorno");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class IncDec {
    /**
     * @class IncDec: Incremento y Decremento
     * @param id ID de la varSymb a aplicar el incremento o decremento.
     * @param is_incremento Bandera para saber que operacion realizar.
     * @param fila
     * @param columna
     */
    constructor(id, is_incremento, fila, columna) {
        this.expresion = false;
        this.arreglo = false;
        this.id = id;
        this.is_incremento = is_incremento;
        this.fila = fila;
        this.columna = columna;
        if (is_incremento) {
            this.tipo_incr_decr = "incremento";
        }
        else {
            this.tipo_incr_decr = "decremento";
        }
    }
    ejecutar(table, tree) {
        console.log("incr decr");
        console.log(this.id);
        let id;
        if (this.id instanceof Identificador_1.Identificador) {
            id = this.id.id;
        }
        let id_valor = this.id.ejecutar(table, tree);
        // console.log(id);
        if (table.existe(id)) {
            let simbolo_actual = table.getSymbolTabla(id);
            // console.log(simbolo_actual)
            if (simbolo_actual instanceof Errores_1.Errores) {
                return simbolo_actual;
            }
            if ((simbolo_actual.tipo == Tipo_1.TIPO.ENTERO) || (simbolo_actual.tipo == Tipo_1.TIPO.DECIMAL)) {
                let value = simbolo_actual.getValor();
                if (this.is_incremento) {
                    value++;
                }
                else {
                    value--;
                }
                let result = table.updateSymbolTabla(new Simbolo_1.Simbolo(id, simbolo_actual.tipo, this.arreglo, this.fila, this.columna, value));
                if (result instanceof Errores_1.Errores) {
                    // console.log(result);
                    // console.log(`tipoo exp: ${this.expresion.tipo} `)
                    // console.log(`error en updateSymbol ${this.id} `)
                    return result;
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `No puede aplicarse ${this.tipo_incr_decr} a varSymb con ID: "${id}", no es un numero.`, this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `Variable con ID: "${id}", no encontrada en ${this.tipo_incr_decr}.`, this.fila, this.columna);
        }
        return null;
    }
    translate3d(table, tree) {
        let genc3d = tree.generadorC3d;
        let id_identificador;
        if (this.id instanceof Identificador_1.Identificador) {
            id_identificador = this.id.id;
        }
        let id3d = this.id.translate3d(table, tree);
        let varSymb = id3d.simbolo;
        genc3d.gen_Comment(`----------- ${this.tipo_incr_decr.toUpperCase()} ----------`);
        if (table.existe(id_identificador)) {
            console.log("incr decr");
            console.log(id_identificador);
            console.log("id3d");
            console.log(id3d);
            console.log("varSymb");
            console.log(varSymb);
            // let varSymb = table.getSymbolTabla(id_identificador);
            if (varSymb == null) {
                let error = new Errores_1.Errores("C3D ", `Asignacion, varSymb con ID: "${id_identificador}", no se encontro en .`, this.fila, this.columna);
                ;
                tree.updateConsolaPrintln(error.toString());
                tree.Errores.push(error);
                return error;
            }
            if (varSymb instanceof Errores_1.Errores) {
                return varSymb;
            }
            if ((varSymb.tipo == Tipo_1.TIPO.ENTERO) || (varSymb.tipo == Tipo_1.TIPO.DECIMAL)) {
                const temp = genc3d.newTemp();
                const tempaux = genc3d.newTemp();
                genc3d.freeTemp(tempaux);
                let op;
                if (this.is_incremento) {
                    op = '+';
                }
                else {
                    op = '-';
                }
                if (varSymb === null || varSymb === void 0 ? void 0 : varSymb.isGlobal) {
                    genc3d.gen_Comment('iniciando ' + this.tipo_incr_decr + ' global');
                    // genc3d.gen_GetStack(temp, id3d.posicion);
                    // genc3d.gen_Exp(tempaux, temp, '1', op);
                    // genc3d.gen_SetStack(id3d.posicion, tempaux);
                    genc3d.gen_Exp(tempaux, id3d.valor, '1', op);
                    genc3d.gen_SetStack(varSymb.posicion, tempaux);
                }
                else if (varSymb === null || varSymb === void 0 ? void 0 : varSymb.inHeap) {
                    genc3d.gen_Comment('iniciando ' + this.tipo_incr_decr + ' heap');
                    // genc3d.gen_GetHeap(temp, id3d.valor);
                    // genc3d.gen_Exp(tempaux, temp, '1', op);
                    // genc3d.gen_SetHeap(id3d.valor, tempaux);
                    genc3d.gen_Exp(tempaux, id3d.valor, '1', op);
                    genc3d.gen_SetHeap(varSymb.posicion, tempaux);
                }
                else {
                    genc3d.gen_Comment('iniciando ' + this.tipo_incr_decr + ' xd');
                    // genc3d.gen_GetStack(temp, id3d.valor);
                    genc3d.gen_Exp(tempaux, id3d.valor, '1', op);
                    genc3d.gen_SetStack(varSymb.posicion, tempaux);
                }
                return new Retorno_1.Retorno(temp, true, varSymb.tipo);
            }
            else {
                let error = new Errores_1.Errores("Semantico", `No puede aplicarse ${this.tipo_incr_decr} a variable con ID: "${id_identificador}", no es un numero.`, this.fila, this.columna);
                tree.updateConsolaPrintln(error.toString());
                tree.Errores.push(error);
                return error;
            }
        }
        else {
            let error = new Errores_1.Errores("Semantico", `Variable con ID: "${id_identificador}", no encontrada en ${this.tipo_incr_decr}.`, this.fila, this.columna);
            tree.updateConsolaPrintln(error.toString());
            tree.Errores.push(error);
            return error;
        }
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo(this.tipo_incr_decr, "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        if (this.is_incremento) {
            padre.addChildNode(new Nodo_1.Nodo("++", ""));
        }
        else {
            padre.addChildNode(new Nodo_1.Nodo("--", ""));
        }
        return padre;
    }
}
exports.IncDec = IncDec;
