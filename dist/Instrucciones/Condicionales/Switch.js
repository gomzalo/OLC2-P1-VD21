"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
const Nodo_1 = require("../../Ast/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../Transferencia/Break");
const Return_1 = require("../Transferencia/Return");
const Errores_1 = require("../../Ast/Errores");
class Switch {
    constructor(valor_sw, lista_case, lista_default, fila, columna) {
        this.valor_sw = valor_sw;
        this.lista_case = lista_case;
        this.lista_default = lista_default;
        this.columna = columna;
        this.fila = fila;
    }
    ejecutar(table, tree) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
        for (let sw of this.lista_case) {
            sw.valor_sw = this.valor_sw.ejecutar(ts_local, tree);
            if (sw.valor_sw instanceof Errores_1.Errores) {
                tree.getErrores().push(sw.valor_sw);
                tree.updateConsolaPrintln(sw.valor_sw.toString());
            }
        }
        let x = 0;
        for (let ins of this.lista_case) {
            let res = ins.ejecutar(ts_local, tree);
            if (res instanceof Errores_1.Errores) {
                tree.getErrores().push(res);
                tree.updateConsolaPrintln(res.toString());
            }
            if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                // controlador.graficarEntornos(controlador,ts_local," (switch)");
                x = 1;
                break;
            }
            else {
                if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                    // controlador.graficarEntornos(controlador,ts_local," (switch)");
                    return res;
                }
            }
        }
        if (x == 0) {
            for (let ins of this.lista_default) {
                let res = ins.ejecutar(ts_local, tree);
                if (res instanceof Errores_1.Errores) {
                    tree.getErrores().push(res);
                    tree.updateConsolaPrintln(res.toString());
                }
                if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                    // controlador.graficarEntornos(controlador,ts_local," (switch)");
                    break;
                }
                else {
                    if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                        // controlador.graficarEntornos(controlador,ts_local," (switch)");
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
        let padre = new Nodo_1.Nodo("SWITCH", "");
        let condicion = new Nodo_1.Nodo("CONDICION", "");
        condicion.addChildNode(this.valor_sw.ejecutar(table, tree));
        let listaCase = new Nodo_1.Nodo("LISTA CASE", "");
        for (let instr of this.lista_case) {
            listaCase.addChildNode(instr.recorrer(table, tree));
        }
        let listaDefault = new Nodo_1.Nodo("LISTA DEFAULT", "");
        if (this.lista_default != null) {
            for (let instr of this.lista_default) {
                listaDefault.addChildNode(instr.recorrer(table, tree));
            }
        }
        return padre;
    }
}
exports.Switch = Switch;
