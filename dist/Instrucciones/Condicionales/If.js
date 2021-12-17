"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.If = void 0;
const Retorno_1 = require("./../../G3D/Retorno");
const Tipo_1 = require("./../../TablaSimbolos/Tipo");
const Nodo_1 = require("../../Ast/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
const Errores_1 = require("../../Ast/Errores");
class If {
    constructor(condicion, lista_ifs, lista_elses, lista_ifelse, fila, columna) {
        this.condicion = condicion;
        this.lista_ifs = lista_ifs;
        this.lista_elses = lista_elses;
        this.lista_ifelse = lista_ifelse;
        this.columna = columna;
        this.fila = fila;
    }
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //      :::::::::::::::::::::    EJECUTAR      :::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ejecutar(table, tree) {
        // let ts_local = new TablaSimbolos(table);
        let valor_condicion = this.condicion.ejecutar(table, tree);
        // console.log("if cond: " + valor_condicion);
        if (valor_condicion instanceof Errores_1.Errores) {
            tree.getErrores().push(valor_condicion);
            tree.updateConsolaPrintln(valor_condicion.toString());
        }
        if (this.condicion.tipo == Tipo_1.TIPO.BOOLEANO) {
            if (valor_condicion == true) {
                // if(this.lista_ifs != null){
                let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                // this.lista_ifs.forEach(ins => {
                for (let ins of this.lista_ifs) {
                    let res = ins.ejecutar(ts_local, tree);
                    if (res instanceof Errores_1.Errores) {
                        tree.getErrores().push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }
                    //TODO verificar si res es de tipo CONTINUE, BREAK, RETORNO 
                    if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                        return res;
                    }
                    else if (ins instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                        // controlador.graficarEntornos(controlador,ts_local," (case)");
                        break;
                    }
                    else if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                        // controlador.graficarEntornos(controlador,ts_local," (case)");
                        return res;
                    }
                }
                // }
            }
            else {
                if (this.lista_elses != null) {
                    let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                    for (let ins of this.lista_elses) {
                        let res = ins.ejecutar(ts_local, tree);
                        //TODO verificar si res es de tipo CONTINUE, RETORNO
                        if (res instanceof Errores_1.Errores) {
                            tree.getErrores().push(res);
                            tree.updateConsolaPrintln(res.toString());
                        }
                        if (res instanceof Break_1.Detener) {
                            return res;
                        }
                        if (res instanceof Continuar_1.Continuar) {
                            break;
                        }
                        if (res instanceof Return_1.Return) {
                            return res;
                        }
                    }
                }
                else if (this.lista_ifelse != null) {
                    let result = this.lista_ifelse.ejecutar(table, tree);
                    if (result instanceof Errores_1.Errores) {
                        return result;
                    }
                    if (result instanceof Break_1.Detener) {
                        return result;
                    }
                    if (result instanceof Continuar_1.Continuar) {
                        return null;
                    }
                    if (result instanceof Return_1.Return) {
                        return result;
                    }
                }
            }
        }
        else {
            return new Errores_1.Errores("Semantico", "Tipo de dato no booleano en IF", this.fila, this.columna);
        }
        // return null;
    }
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // :::::::::::::::::::::    C3D      :::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
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
            // console.log(valor_condicion.translate3d());
            // console.log("valor_condicion tipo");
            // console.log(valor_condicion.tipo);
            // console.log("valor_condicion istemp");
            // console.log(valor_condicion.istemp);
            if (this.condicion.tipo == Tipo_1.TIPO.BOOLEANO) {
                let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                if (valor_condicion.istemp) {
                    genc3d.gen_If(valor_condicion.valor, "1", "==", valor_condicion.lblTrue);
                    genc3d.gen_Goto(valor_condicion.lblFalse);
                }
                genc3d.gen_Label(valor_condicion.lblTrue);
                this.lista_ifs.forEach(instruccion => {
                    instruccion.translate3d(ts_local, tree);
                });
                if (this.lista_elses != null) {
                    let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                    genc3d.gen_Goto(lb_exit);
                    genc3d.gen_Label(valor_condicion.lblFalse);
                    this.lista_elses.forEach(instruccion => {
                        instruccion.translate3d(ts_local, tree);
                    });
                    genc3d.gen_Label(lb_exit);
                }
                else if (this.lista_ifelse != null) {
                    let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                    this.lista_ifelse.translate3d(ts_local, tree);
                }
                else {
                    genc3d.gen_Label(valor_condicion.lblFalse);
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
        for (let instr of this.lista_ifs) {
            listaIfs.addChildNode(instr.recorrer(table, tree));
        }
        padre.addChildNode(listaIfs);
        // LISTA IFS
        if (this.lista_elses != null) {
            let listaElse = new Nodo_1.Nodo("INSTRUCCIONES Else", "");
            for (let instr of this.lista_elses) {
                listaElse.addChildNode(instr.recorrer(table, tree));
            }
            padre.addChildNode(listaElse);
        }
        // LISTA IFS
        if (this.lista_ifelse != null) {
            padre.addChildNode(this.lista_ifelse.recorrer(table, tree));
        }
        return padre;
    }
    getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }
}
exports.If = If;
