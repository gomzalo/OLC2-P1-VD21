"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.For = void 0;
const Return_1 = require("./../Transferencia/Return");
const Continuar_1 = require("./../Transferencia/Continuar");
const Nodo_1 = require("../../Ast/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = require("../Transferencia/Break");
const Errores_1 = require("../../Ast/Errores");
class For {
    /**
     * @class For
     * @gramatica   RFOR PARA declaracion_asignacion PUNTOCOMA
                    expr PUNTOCOMA actualizacion PARC
                    LLAVA instrucciones LLAVC
     * @param declaracion_asignacion
     * @param condicion
     * @param actualizacion
     * @param lista_instrucciones
     * @param fila
     * @param columna
     */
    constructor(declaracion_asignacion, condicion, actualizacion, lista_instrucciones, fila, columna) {
        this.declaracion_asignacion = declaracion_asignacion;
        this.condicion = condicion;
        this.actualizacion = actualizacion;
        this.lista_instrucciones = lista_instrucciones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // Asignacion o declaracion
        let tabla_intermedia = new TablaSimbolos_1.TablaSimbolos(table);
        let declaracion_asignacion = this.declaracion_asignacion.ejecutar(tabla_intermedia, tree);
        if (declaracion_asignacion instanceof Errores_1.Errores) {
            tree.getErrores().push(declaracion_asignacion);
            tree.updateConsolaPrintln(declaracion_asignacion.toString());
        }
        // console.log("declaracion_asignacion: " + declaracion_asignacion);
        if (declaracion_asignacion instanceof Errores_1.Errores) {
            return declaracion_asignacion;
        }
        while (true) {
            let condicion = this.condicion.ejecutar(tabla_intermedia, tree);
            if (condicion instanceof Errores_1.Errores) {
                tree.getErrores().push(condicion);
                tree.updateConsolaPrintln(condicion.toString());
            }
            // console.log("condicion: " + condicion);
            if (this.condicion.tipo == Tipo_1.TIPO.BOOLEANO) {
                if (this.getBool(condicion)) {
                    let ts_local = new TablaSimbolos_1.TablaSimbolos(tabla_intermedia);
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
                    let actualizacion = this.actualizacion.ejecutar(tabla_intermedia, tree);
                    if (actualizacion instanceof Errores_1.Errores) {
                        tree.getErrores().push(actualizacion);
                        tree.updateConsolaPrintln(actualizacion.toString());
                    }
                    // console.log("actualizacion: " + actualizacion);
                    if (actualizacion instanceof Errores_1.Errores) {
                        return actualizacion;
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
        genc3d.gen_Comment('------------ FOR -----------');
        let declaracion_asignacion = this.declaracion_asignacion.translate3d(entornoLocal, tree);
        genc3d.gen_Comment('----- Iniciacion');
        if (declaracion_asignacion instanceof Errores_1.Errores) {
            tree.getErrores().push(declaracion_asignacion);
            tree.updateConsolaPrintln(declaracion_asignacion.toString());
        }
        genc3d.gen_Label(lbl);
        genc3d.gen_Comment("Validacion de condicion");
        // console.log("for3d");
        // console.log("declaracion_asignacion");
        // console.log(declaracion_asignacion);
        let condicion = this.condicion.translate3d(entornoLocal, tree);
        // console.log(condicion.tipo);
        if (condicion.tipo !== Tipo_1.TIPO.BOOLEANO) {
            // console.log("err tipo no bool");
            let error = new Errores_1.Errores("c3d", "La condicion no es booleana.", this.fila, this.columna);
            tree.Errores.push(error);
            tree.updateConsolaPrintln(error.toString());
        }
        genc3d.gen_Comment("Instrucciones dentro de For");
        entornoLocal.break = condicion.lblFalse;
        entornoLocal.continue = lbl;
        genc3d.gen_Label(condicion.lblTrue);
        this.lista_instrucciones.forEach(instruccion => {
            let ins = instruccion.translate3d(entornoLocal, tree);
            // console.log("instr for");
            // console.log(ins);
        });
        genc3d.gen_Comment("Actualizacion");
        let actualizacion = this.actualizacion.translate3d(entornoLocal, tree);
        // console.log(actualizacion);
        genc3d.gen_Goto(lbl);
        genc3d.gen_Label(condicion.lblFalse);
        genc3d.gen_Comment('------------ FIN FOR -----------');
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("FOR", "");
        let decla = new Nodo_1.Nodo("DECLARACION", "");
        decla.addChildNode(this.declaracion_asignacion.recorrer(table, tree));
        let condicion = new Nodo_1.Nodo("CONDICION", "");
        condicion.addChildNode(this.condicion.ejecutar(table, tree));
        let actualizacion = new Nodo_1.Nodo("ACTUALIZACION", "");
        actualizacion.addChildNode(this.actualizacion.ejecutar(table, tree));
        let NodoInstr = new Nodo_1.Nodo("INSTRUCCIONES", "");
        for (let instr of this.lista_instrucciones) {
            NodoInstr.addChildNode(instr.recorrer(table, tree));
        }
        padre.addChildNode(decla);
        padre.addChildNode(condicion);
        padre.addChildNode(actualizacion);
        padre.addChildNode(NodoInstr);
        return padre;
    }
    getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }
}
exports.For = For;
