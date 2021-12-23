"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Case = void 0;
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
class Case {
    /**
     *
     * @param condicion_case Condicion a evaluar en el case
     * @param lista_instrucciones Lista de instrucciones dentro del case
     * @param fila Numero de fila
     * @param columna Numero de columna
     */
    constructor(condicion_case, lista_instrucciones, fila, columna) {
        this.condicion_case = condicion_case;
        this.lista_instrucciones = lista_instrucciones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
        // console.log("cs valcs: " + this.condicion_case);
        // console.log("cs valorsw: " + this.condicion_sw);
        if (this.condicion_sw == this.condicion_case.ejecutar(table, tree)) {
            for (let res of this.lista_instrucciones) {
                let ins = res.ejecutar(ts_local, tree);
                if (ins instanceof Errores_1.Errores) {
                    tree.getErrores().push(ins);
                    tree.updateConsolaPrintln(ins.toString());
                }
                if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                    // controlador.graficarEntornos(controlador,ts_local," (case)");
                    return ins;
                }
                else {
                    if (ins instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                        // controlador.graficarEntornos(controlador,ts_local," (case)");
                        return ins;
                    }
                    else {
                        if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                            // controlador.graficarEntornos(controlador,ts_local," (case)");
                            return ins;
                        }
                    }
                }
            }
        }
        else {
            return;
        }
    }
    translate3d(table, tree) {
        // let genc3d = tree.generadorC3d;
        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
        if (this.condicion_sw == this.condicion_case.translate3d(table, tree)) {
            this.lista_instrucciones.forEach(instruccion => {
                let ins = instruccion.translate3d(ts_local, tree);
                if (ins instanceof Break_1.Detener || ins instanceof Return_1.Return || ins instanceof Continuar_1.Continuar) {
                    return ins;
                }
            });
        }
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("CASE", "");
        let expresion = new Nodo_1.Nodo("EXPRESION", "");
        expresion.addChildNode(this.condicion_case.recorrer(table, tree));
        padre.addChildNode(expresion);
        let NodoInstr = new Nodo_1.Nodo("INSTRUCCIONES", "");
        for (let instr of this.lista_instrucciones) {
            NodoInstr.addChildNode(instr.recorrer(table, tree));
        }
        padre.addChildNode(NodoInstr);
        return padre;
    }
}
exports.Case = Case;
