"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForIn = void 0;
const Identificador_1 = require("./../../Expresiones/Identificador");
const Return_1 = require("../Transferencia/Return");
const Continuar_1 = require("../Transferencia/Continuar");
const Nodo_1 = require("../../Ast/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = require("../Transferencia/Break");
const Errores_1 = require("../../Ast/Errores");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const AccesoArr_1 = require("../../Expresiones/Arreglos/AccesoArr");
class ForIn {
    constructor(iterador, rango, lista_instrucciones, fila, columna) {
        this.arreglo = false;
        this.iterador = iterador;
        this.rango = rango;
        this.lista_instrucciones = lista_instrucciones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        if (this.rango.tipo == Tipo_1.TIPO.CADENA) {
            let rango = this.rango.ejecutar(table, tree);
            if (rango instanceof Errores_1.Errores) {
                tree.getErrores().push(rango);
                tree.updateConsolaPrintln(rango.toString());
            }
            if (rango instanceof Errores_1.Errores) {
                return rango;
            }
            console.log("FOR IN CADENA");
            for (var i = 0; i < rango.length; i++) {
                let char = rango.charAt(i);
                let nuevo_simb = new Simbolo_1.Simbolo(this.iterador, Tipo_1.TIPO.CHARACTER, this.arreglo, this.fila, this.columna, char);
                let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                ts_local.setSymbolTabla(nuevo_simb);
                ts_local.updateSymbolTabla(nuevo_simb);
                for (let ins of this.lista_instrucciones) {
                    let res = ins.ejecutar(ts_local, tree);
                    if (res instanceof Errores_1.Errores) {
                        tree.getErrores().push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }
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
        else if (this.rango.tipo == Tipo_1.TIPO.ARREGLO || this.rango instanceof Array) {
            console.log("FOR IN ARR XD");
            this.rango.forEach(e => {
                let element = e.ejecutar(table, tree);
                if (element instanceof Errores_1.Errores) {
                    tree.getErrores().push(element);
                    tree.updateConsolaPrintln(element.toString());
                }
                if (element instanceof Errores_1.Errores) {
                    return element;
                }
                let nuevo_simb = new Simbolo_1.Simbolo(this.iterador, Tipo_1.TIPO.ARREGLO, this.arreglo, this.fila, this.columna, element);
                let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                let result = ts_local.updateSymbolTabla(nuevo_simb);
                if (result instanceof Errores_1.Errores) {
                    result = ts_local.setSymbolTabla(nuevo_simb);
                    if (result instanceof Errores_1.Errores) {
                        tree.getErrores().push(result);
                        tree.updateConsolaPrintln(result.toString());
                    }
                }
                for (let ins of this.lista_instrucciones) {
                    let res = ins.ejecutar(ts_local, tree);
                    if (res instanceof Errores_1.Errores) {
                        tree.getErrores().push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }
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
            });
        }
        else if (this.rango instanceof AccesoArr_1.AccesoArr) {
            console.log("FOR IN ARR DEC RANGO");
            // console.log(this.rango.);
            let arr = table.getSymbolTabla(this.rango.id.toString());
            if (arr != null) {
                if (arr.getArreglo()) {
                    console.log("foinarrdec rank: " + this.rango.expresiones[0]);
                    let rank = this.rango.expresiones[0].ejecutar(table, tree);
                    // console.log("AccArr rank type: " + (rank instanceof Array));
                    // console.log("rank[0] type: " + (typeof(rank[0]) == "string"));
                    // console.log("rank accArr: " + rank);
                    if (rank == null) {
                        return new Errores_1.Errores("Semantico", "La variable \'" + this.rango.id + "\', no es un rango.", this.fila, this.columna);
                    }
                    let begin;
                    if (rank[0] == "begin") {
                        begin = 0;
                    }
                    else {
                        begin = rank[0].ejecutar(table, tree);
                    }
                    if (begin instanceof Errores_1.Errores) {
                        return begin;
                    }
                    let end;
                    if (rank[1] == "end") {
                        end = arr.getValor().length;
                    }
                    else {
                        end = rank[1].ejecutar(table, tree);
                    }
                    if (end instanceof Errores_1.Errores) {
                        return end;
                    }
                    console.log("begin: " + begin);
                    console.log("end: " + end);
                    let array = [];
                    let contador = begin;
                    while (contador <= end) {
                        array.push(arr.getValor()[contador]);
                        let element = arr.getValor()[contador];
                        let nuevo_simb = new Simbolo_1.Simbolo(this.iterador, Tipo_1.TIPO.ARREGLO, this.arreglo, this.fila, this.columna, element);
                        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                        let result = ts_local.updateSymbolTabla(nuevo_simb);
                        if (result instanceof Errores_1.Errores) {
                            result = ts_local.setSymbolTabla(nuevo_simb);
                            if (result instanceof Errores_1.Errores) {
                                tree.getErrores().push(result);
                                tree.updateConsolaPrintln(result.toString());
                            }
                        }
                        for (let ins of this.lista_instrucciones) {
                            let res = ins.ejecutar(ts_local, tree);
                            if (res instanceof Errores_1.Errores) {
                                tree.getErrores().push(res);
                                tree.updateConsolaPrintln(res.toString());
                            }
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
                        contador++;
                    }
                }
                else {
                    return new Errores_1.Errores("Semantico", "La variable \'" + this.rango.id.toString() + "\', no es un arreglo.", this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", "La variable \'" + this.rango.id.toString() + "\', no existe.", this.fila, this.columna);
            }
        }
        else if (this.rango instanceof Identificador_1.Identificador) {
            let variable = table.getSymbolTabla(this.rango.id.toString());
            if (variable != null) {
                let rango = variable.getValor();
                if (rango instanceof Errores_1.Errores) {
                    tree.getErrores().push(rango);
                    tree.updateConsolaPrintln(rango.toString());
                }
                if (rango instanceof Errores_1.Errores) {
                    return rango;
                }
                if (variable.getTipo() == Tipo_1.TIPO.CADENA && !variable.getArreglo()) {
                    console.log("FOR IN VAR CADENA");
                    for (var i = 0; i < rango.length; i++) {
                        let char = rango.charAt(i);
                        let nuevo_simb = new Simbolo_1.Simbolo(this.iterador, Tipo_1.TIPO.CHARACTER, this.arreglo, this.fila, this.columna, char);
                        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                        ts_local.setSymbolTabla(nuevo_simb);
                        ts_local.updateSymbolTabla(nuevo_simb);
                        for (let ins of this.lista_instrucciones) {
                            let res = ins.ejecutar(ts_local, tree);
                            if (res instanceof Errores_1.Errores) {
                                tree.getErrores().push(res);
                                tree.updateConsolaPrintln(res.toString());
                            }
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
                else if (variable.getArreglo()) {
                    console.log("FOR IN ARR DEC");
                    variable.getValor().forEach(element => {
                        let nuevo_simb = new Simbolo_1.Simbolo(this.iterador, Tipo_1.TIPO.ARREGLO, this.arreglo, this.fila, this.columna, element);
                        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                        let result = ts_local.updateSymbolTabla(nuevo_simb);
                        if (result instanceof Errores_1.Errores) {
                            result = ts_local.setSymbolTabla(nuevo_simb);
                            if (result instanceof Errores_1.Errores) {
                                tree.getErrores().push(result);
                                tree.updateConsolaPrintln(result.toString());
                            }
                        }
                        for (let ins of this.lista_instrucciones) {
                            let res = ins.ejecutar(ts_local, tree);
                            if (res instanceof Errores_1.Errores) {
                                tree.getErrores().push(res);
                                tree.updateConsolaPrintln(res.toString());
                            }
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
                    });
                }
            }
            else {
                return new Errores_1.Errores("Semantico", "La variable \'" + this.rango.id.toString() + "\', no existe.", this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", "For-in no valido.", this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error('Method not implemented FOR IN.');
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("FOR-IN", "");
        let iterador = new Nodo_1.Nodo("ITERADOR", "");
        iterador.addChildNode(new Nodo_1.Nodo(this.iterador, ""));
        let rango = new Nodo_1.Nodo("RANGO", "");
        // recorriendo rango
        if (this.rango.tipo == Tipo_1.TIPO.CADENA || this.rango instanceof Identificador_1.Identificador) {
            rango.addChildNode(this.rango.recorrer(table, tree));
        }
        else if (this.rango.tipo == Tipo_1.TIPO.ARREGLO || this.rango instanceof Array) {
            for (let r of this.rango) {
                rango.addChildNode(r.recorrer(table, tree));
            }
        }
        else if (this.rango instanceof AccesoArr_1.AccesoArr) {
            rango.addChildNode(this.rango.recorrer(table, tree));
        }
        // rango.addChildNode(this.rango.recorrer(table,tree));
        let NodoInstr = new Nodo_1.Nodo("INSTRUCCIONES", "");
        for (let instr of this.lista_instrucciones) {
            NodoInstr.addChildNode(instr.recorrer(table, tree));
        }
        padre.addChildNode(iterador);
        padre.addChildNode(rango);
        padre.addChildNode(NodoInstr);
        return padre;
    }
    getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }
}
exports.ForIn = ForIn;
