"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.While = void 0;
const Errores_1 = require("./../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
class While {
    constructor(condicion, lista_instrucciones, fila, columna) {
        this.condicion = condicion;
        this.lista_instrucciones = lista_instrucciones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        while (true) {
            let valor_condicion = this.condicion.ejecutar(table, tree);
            if (valor_condicion instanceof Errores_1.Errores) {
                tree.getErrores().push(valor_condicion);
                tree.updateConsolaPrintln(valor_condicion.toString());
            }
            if (this.condicion.tipo == Tipo_1.TIPO.BOOLEANO) {
                if (this.getBool(valor_condicion)) {
                    let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                    for (let ins of this.lista_instrucciones) {
                        let res = ins.ejecutar(ts_local, tree);
                        if (res instanceof Errores_1.Errores) {
                            tree.getErrores().push(res);
                            tree.updateConsolaPrintln(res.toString());
                        }
                        //TODO verificar si res es de tipo CONTINUE, BREAK, RETORNO 
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
                else {
                    break;
                }
            }
            else {
                return new Errores_1.Errores("Semantico", "Valor no booleano", this.fila, this.columna);
            }
        }
    }
    translate3d(table, tree) {
        let genc3d = tree.generadorC3d;
        let lbl = genc3d.newLabel();
        let entornoLocal = new TablaSimbolos_1.TablaSimbolos(table);
        genc3d.gen_Comment('------------ WHILE -----------');
        genc3d.gen_Label(lbl);
        let condicion = this.condicion.translate3d(table);
        if (condicion.tipo !== Tipo_1.TIPO.BOOLEANO) {
            let error = new Errores_1.Errores("c3d", "La condicion no  es boolean", this.fila, this.columna);
            tree.updateConsolaPrintln(error.toString());
        }
        entornoLocal.break = condicion.lblFalse;
        entornoLocal.continue = lbl;
        genc3d.gen_Label(condicion.lblTrue);
        for (let inst of this.lista_instrucciones) {
            inst.translate3d(table, tree);
        }
        // this.sentencias.translate3d(entornoLocal);
        genc3d.gen_Goto(lbl);
        genc3d.gen_Label(condicion.lblFalse);
        genc3d.gen_Comment('-----------fin while -------');
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("WHILE", "");
        padre.addChildNode(new Nodo_1.Nodo("while", ""));
        // padre.addChildNode(new Nodo("(",""));
        padre.addChildNode(this.condicion.recorrer(table, tree));
        // padre.addChildNode(new Nodo(")",""));
        // padre.addChildNode(new Nodo("{",""));
        padre.addChildNode(new Nodo_1.Nodo("INSTRUCCIONES", ""));
        for (let ins of this.lista_instrucciones) {
            padre.addChildNode(ins.recorrer(table, tree));
        }
        // padre.addChildNode(new Nodo("}",""));
        return padre;
    }
    getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }
}
exports.While = While;
