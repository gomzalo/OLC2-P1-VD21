"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForIn = void 0;
const Return_1 = require("../Transferencia/Return");
const Continuar_1 = require("../Transferencia/Continuar");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = require("../Transferencia/Break");
const Errores_1 = require("../../Ast/Errores");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
class ForIn {
    constructor(iterador, rango, lista_instrucciones, fila, columna) {
        this.iterador = iterador;
        this.rango = rango;
        this.lista_instrucciones = lista_instrucciones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let rango = this.rango.ejecutar(table, tree);
        if (rango instanceof Errores_1.Errores) {
            return rango;
        }
        if (this.rango.tipo == Tipo_1.TIPO.CADENA) {
            for (var i = 0; i < rango.length; i++) {
                let char = rango.charAt(i);
                let nuevo_simb = new Simbolo_1.Simbolo(this.iterador, Tipo_1.TIPO.CHARACTER, null, this.fila, this.columna, char);
                let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                ts_local.setSymbolTabla(nuevo_simb);
                ts_local.updateSymbolTabla(nuevo_simb);
                for (let ins of this.lista_instrucciones) {
                    let res = ins.ejecutar(ts_local, tree);
                    if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                        return null;
                    }
                    if (ins instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                        break;
                    }
                    if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                        return res;
                    }
                }
            }
        }
    }
    translate3d(table, tree) {
        throw new Error('Method not implemented.');
    }
    recorrer(table, tree) {
        throw new Error('Method not implemented.');
    }
    getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }
}
exports.ForIn = ForIn;
