"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ifsinllave = void 0;
const Tipo_1 = require("./../../TablaSimbolos/Tipo");
const Nodo_1 = require("../../Ast/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
const Errores_1 = require("../../Ast/Errores");
const Retorno_1 = require("../../G3D/Retorno");
class Ifsinllave {
    constructor(condicion, ins_ifs, ins_elses, fila, columna) {
        this.condicion = condicion;
        this.ins_ifs = ins_ifs;
        this.ins_elses = ins_elses;
        this.columna = columna;
        this.fila = fila;
    }
    ejecutar(table, tree) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
        let valor_condicion = this.condicion.ejecutar(table, tree);
        if (valor_condicion instanceof Errores_1.Errores) {
            tree.getErrores().push(valor_condicion);
            tree.updateConsolaPrintln(valor_condicion.toString());
        }
        if (this.condicion.tipo == Tipo_1.TIPO.BOOLEANO) {
            if (valor_condicion) {
                let res = this.ins_ifs.ejecutar(ts_local, tree);
                if (res instanceof Errores_1.Errores) {
                    tree.getErrores().push(res);
                    tree.updateConsolaPrintln(res.toString());
                }
                //TODO verificar si res es de tipo CONTINUE, BREAK, RETORNO 
                if (this.ins_ifs instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                    return res;
                }
                else {
                    if (this.ins_ifs instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                        // controlador.graficarEntornos(controlador,ts_local," (case)");
                        return this.ins_ifs;
                    }
                    else {
                        if (this.ins_ifs instanceof Return_1.Return || res instanceof Return_1.Return) {
                            // controlador.graficarEntornos(controlador,ts_local," (case)");
                            return this.ins_ifs;
                        }
                    }
                }
            }
            else {
                if (this.ins_elses instanceof Array) {
                    this.ins_elses.forEach(ins => {
                        let res = ins.ejecutar(ts_local, tree);
                        if (res instanceof Errores_1.Errores) {
                            tree.getErrores().push(res);
                            tree.updateConsolaPrintln(res.toString());
                        }
                        if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                            return res;
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
                    });
                    //TODO verificar si res es de tipo CONTINUE, RETORNO 
                }
                else {
                    let res = this.ins_elses.ejecutar(ts_local, tree);
                    if (res instanceof Errores_1.Errores) {
                        tree.getErrores().push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }
                    //TODO verificar si res es de tipo CONTINUE, RETORNO 
                    if (this.ins_elses instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                        return res;
                    }
                    else {
                        if (this.ins_elses instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                            // controlador.graficarEntornos(controlador,ts_local," (case)");
                            return this.ins_elses;
                        }
                        else {
                            if (this.ins_elses instanceof Return_1.Return || res instanceof Return_1.Return) {
                                // controlador.graficarEntornos(controlador,ts_local," (case)");
                                return this.ins_elses;
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
    translate3d(table, tree) {
        const genc3d = tree.generadorC3d;
        let valor_condicion = this.condicion.translate3d(table, tree);
        let lb_exit = genc3d.newLabel();
        if (valor_condicion instanceof Errores_1.Errores) {
            tree.getErrores().push(valor_condicion);
            tree.updateConsolaPrintln(valor_condicion.toString());
        }
        if (valor_condicion instanceof Retorno_1.Retorno) {
            // console.log("valor_condicion valor");
            // console.log(valor_condicion);
            // console.log("valor_condicion tipo");
            // console.log(valor_condicion.tipo);
            // console.log("valor_condicion istemp");
            // console.log(valor_condicion.istemp);
            if (this.condicion.tipo == Tipo_1.TIPO.BOOLEANO) {
                let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                // if(valor_condicion.istemp){
                //     genc3d.gen_If(valor_condicion.valor, "1", "==", valor_condicion.lblTrue);
                //     genc3d.gen_Goto(valor_condicion.lblFalse);
                // }
                // console.log("ingreso a if.");
                genc3d.gen_Label(valor_condicion.lblTrue);
                this.ins_ifs.translate3d(ts_local, tree);
                genc3d.gen_Goto(lb_exit);
                genc3d.gen_Label(valor_condicion.lblFalse);
                if (this.ins_elses != null) {
                    // console.log("ingreso a else.");
                    // let ts_local = new TablaSimbolos(table);
                    // genc3d.gen_Goto(lb_exit);
                    // genc3d.gen_Label(valor_condicion.lblFalse);
                    if (this.ins_elses instanceof Array) {
                        this.ins_elses.forEach(ins => {
                            ins.translate3d(ts_local, tree);
                        });
                    }
                    else {
                        this.ins_elses.translate3d(ts_local, tree);
                    }
                    genc3d.gen_Label(lb_exit);
                }
                else {
                    genc3d.gen_Label(lb_exit);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", "Tipo de dato no booleano en IF", this.fila, this.columna);
            }
        }
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("IF", "");
        let condicion = new Nodo_1.Nodo("CONDICION", "");
        condicion.addChildNode(this.condicion.ejecutar(table, tree));
        // LISTA IFS
        let listaIfs = new Nodo_1.Nodo("INSTRUCCIONES IFS", "");
        // for(let instr of this.lista_ifs)
        // {
        //     listaIfs.addChildNode(instr.recorrer(table,tree));
        // }
        // padre.addChildNode(listaIfs);
        // LISTA IFS
        if (this.ins_ifs != null) {
            listaIfs.addChildNode(this.ins_ifs.recorrer(table, tree));
        }
        padre.addChildNode(condicion);
        padre.addChildNode(listaIfs);
        // LISTA IFS
        if (this.ins_elses != null && this.ins_elses instanceof Array) {
            for (let nodo of this.ins_elses) {
                padre.addChildNode(nodo.recorrer(table, tree));
            }
        }
        return padre;
    }
}
exports.Ifsinllave = Ifsinllave;
