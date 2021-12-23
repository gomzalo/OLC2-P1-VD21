"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoWhile = void 0;
const Nodo_1 = require("../../Ast/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
const Errores_1 = require("../../Ast/Errores");
class DoWhile {
    constructor(condicion, lista_instrucciones, fila, columna) {
        this.condicion = condicion;
        this.lista_instrucciones = lista_instrucciones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let valor_condicion = this.condicion.ejecutar(table, tree);
        if (valor_condicion instanceof Errores_1.Errores) {
            tree.getErrores().push(valor_condicion);
            tree.updateConsolaPrintln(valor_condicion.toString());
        }
        if (typeof valor_condicion == 'boolean') {
            do {
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
                    else {
                        if (ins instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                            break;
                        }
                        else {
                            if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                                return res;
                            }
                        }
                    }
                }
            } while (this.condicion.ejecutar(table, tree));
        }
    }
    translate3d(table, tree) {
        let genc3d = tree.generadorC3d;
        let entornoLocal = new TablaSimbolos_1.TablaSimbolos(table);
        genc3d.gen_Comment('------------ DO WHILE -----------');
        entornoLocal.continue = this.condicion.lblTrue = genc3d.newLabel();
        entornoLocal.break = this.condicion.lblFalse = genc3d.newLabel();
        genc3d.gen_Label(this.condicion.lblTrue);
        for (let inst of this.lista_instrucciones) {
            inst.translate3d(entornoLocal, tree);
        }
        genc3d.gen_Comment('-----Condicion');
        let condicion = this.condicion.translate3d(table, tree);
        if (condicion.tipo !== Tipo_1.TIPO.BOOLEANO) {
            let error = new Errores_1.Errores("c3d", "La condicion no es booleana.", this.fila, this.columna);
            tree.Errores.push(error);
            tree.updateConsolaPrintln(error.toString());
        }
        genc3d.gen_Label(condicion.lblFalse);
        genc3d.gen_Comment('----------- FIN DO WHILE  -------');
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("DO WHILE", "");
        let NodoInstr = new Nodo_1.Nodo("INSTRUCCIONES", "");
        for (let instr of this.lista_instrucciones) {
            NodoInstr.addChildNode(instr.recorrer(table, tree));
        }
        padre.addChildNode(NodoInstr);
        let condicion = new Nodo_1.Nodo("CONDICION", "");
        condicion.addChildNode(this.condicion.ejecutar(table, tree));
        padre.addChildNode(condicion);
        return padre;
    }
}
exports.DoWhile = DoWhile;
