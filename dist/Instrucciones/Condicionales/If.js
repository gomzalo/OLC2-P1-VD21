"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.If = void 0;
const Tipo_1 = require("./../../TablaSimbolos/Tipo");
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
    ejecutar(table, tree) {
        // let ts_local = new TablaSimbolos(table);
        let valor_condicion = this.condicion.ejecutar(table, tree);
        if (valor_condicion instanceof Errores_1.Errores) {
            tree.getErrores().push(valor_condicion);
            tree.updateConsolaPrintln(valor_condicion.toString());
        }
        if (this.condicion.tipo == Tipo_1.TIPO.BOOLEANO) {
            if (this.getBool(valor_condicion)) {
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
                    else {
                        if (ins instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                            // controlador.graficarEntornos(controlador,ts_local," (case)");
                            return res;
                        }
                        else {
                            if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                                // controlador.graficarEntornos(controlador,ts_local," (case)");
                                return res;
                            }
                        }
                    }
                }
                ;
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
                            return res;
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
                        return result;
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
        return null;
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
exports.If = If;
