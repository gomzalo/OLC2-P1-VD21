"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
const Retorno_1 = require("./../../G3D/Retorno");
const Nodo_1 = require("../../Ast/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = require("../Transferencia/Break");
const Return_1 = require("../Transferencia/Return");
const Errores_1 = require("../../Ast/Errores");
class Switch {
    /**
     *
     * @param condicion_sw Condicion del switch
     * @param lista_case Lista instrucciones de cases dentro del switch
     * @param lista_default Lista instrucciones en default
     * @param fila Numero de fila
     * @param columna Numero de columna
     */
    constructor(condicion_sw, lista_case, lista_default, fila, columna) {
        this.condicion_sw = condicion_sw;
        this.lista_case = lista_case;
        this.lista_default = lista_default;
        this.columna = columna;
        this.fila = fila;
    }
    ejecutar(table, tree) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
        for (let case_temp of this.lista_case) {
            case_temp.condicion_sw = this.condicion_sw.ejecutar(ts_local, tree);
            if (case_temp.condicion_case instanceof Errores_1.Errores) {
                tree.getErrores().push(case_temp.condicion_case);
                tree.updateConsolaPrintln(case_temp.condicion_case.toString());
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
    /**
     * Traduce a codigo de tres direcciones
     * @param table
     * @param tree
     */
    translate3d(table, tree) {
        const genc3d = tree.generadorC3d;
        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
        const lb_exit = genc3d.newLabel();
        let tempBool = '';
        genc3d.gen_Comment('--------- INICIA SWITCH ---------');
        const condicion = this.condicion_sw.translate3d(table, tree);
        if (condicion.tipo == Tipo_1.TIPO.BOOLEANO) {
            const lbljump = genc3d.newLabel();
            const temp = genc3d.newTemp();
            genc3d.gen_Label(condicion.lblTrue);
            genc3d.genAsignaTemp(temp, '1');
            genc3d.gen_Goto(lbljump);
            genc3d.gen_Label(condicion.lblFalse);
            genc3d.genAsignaTemp(temp, '0');
            genc3d.gen_Label(lbljump);
            tempBool = temp;
        }
        if (condicion.tipo !== Tipo_1.TIPO.ENTERO && condicion.tipo !== Tipo_1.TIPO.DECIMAL && condicion.tipo !== Tipo_1.TIPO.BOOLEANO) {
            return new Errores_1.Errores('Semantico', 'Tipo de condicion incorrecta.', this.fila, this.columna);
        }
        this.lista_case.forEach(case_temp => {
            case_temp.condicion_sw = this.condicion_sw.translate3d(ts_local, tree);
        });
        ts_local.break == lb_exit;
        let num_default = false;
        let lb_case_true = genc3d.newLabel();
        let lb_case_false = genc3d.newLabel();
        let x = 0;
        this.lista_case.forEach(ins_case => {
            let res_case = ins_case.translate3d(ts_local, tree);
            if (ins_case instanceof Retorno_1.Retorno) {
            }
            if (ins_case instanceof Break_1.Detener) {
                x = 1;
                // break;
            }
        });
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("SWITCH", "");
        let condicion = new Nodo_1.Nodo("CONDICION", "");
        condicion.addChildNode(this.condicion_sw.ejecutar(table, tree));
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
