"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ast = void 0;
const DeclararStruct_1 = require("./../Instrucciones/Struct/DeclararStruct");
const Asignacion_1 = require("../Instrucciones/Asignacion");
const Declaracion_1 = require("../Instrucciones/Declaracion");
const Main_1 = require("../Instrucciones/Metodos/Main");
const Funcion_1 = require("../Instrucciones/Metodos/Funcion");
const Break_1 = require("../Instrucciones/Transferencia/Break");
const Continuar_1 = require("../Instrucciones/Transferencia/Continuar");
const Return_1 = require("../Instrucciones/Transferencia/Return");
const TablaSimbolos_1 = require("../TablaSimbolos/TablaSimbolos");
const Errores_1 = require("./Errores");
const Struct_1 = require("../Instrucciones/Struct/Struct");
const DeclaracionArr_1 = require("../Instrucciones/Arreglos/DeclaracionArr");
const ModificacionArr_1 = require("../Instrucciones/Arreglos/ModificacionArr");
const Nodo_1 = require("./Nodo");
const GeneradorC3D_1 = require("../G3D/GeneradorC3D");
class Ast {
    constructor() {
        this.consola = "";
        this.dot = "";
        this.strEntorno = "";
        this.instrucciones = new Array();
        this.funciones = new Array();
        this.structs = new Array();
        this.Errores = new Array();
        this.consola = "";
        // this.TSglobal =  null;
        this.dot = "";
        this.contador = 0;
        this.strEntorno = "";
        this.TSglobal = new TablaSimbolos_1.TablaSimbolos(null);
        this.generadorC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        this.repGramatical = new Array();
    }
    ejecutar() {
        let tree = this;
        tree.setTSGlobal(this.TSglobal);
        // 1ERA PASADA: 
        // GUARDAR FUNCIONES  Y METODOS
        for (let instr of this.instrucciones) {
            // let value = null;
            if (instr instanceof Funcion_1.Funcion) {
                this.addFunction(instr);
            }
            if (instr instanceof Struct_1.Struct) {
                this.addStruct(instr);
            }
            if (instr instanceof Declaracion_1.Declaracion || instr instanceof Asignacion_1.Asignacion || instr instanceof DeclaracionArr_1.DeclaracionArr || instr instanceof DeclararStruct_1.DeclararStruct || instr instanceof ModificacionArr_1.ModificacionArr) {
                let value = instr.ejecutar(this.TSglobal, tree);
                if (value instanceof Errores_1.Errores) {
                    this.getErrores().push(value);
                    this.updateConsolaPrintln(value.toString());
                }
                if (value instanceof Break_1.Detener) {
                    let error = new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
                if (value instanceof Continuar_1.Continuar) {
                    let error = new Errores_1.Errores("Semantico", "Sentencia Continue fuera de Instruccion Ciclo", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
                if (value instanceof Return_1.Return) {
                    let error = new Errores_1.Errores("Semantico", "Sentencia Return fuera de Metodos/Control/Ciclos", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
            }
        }
        // 2DA PASADA
        // EJECUTAMOS TODAS LAS FUNCIONES
        for (let instr of this.instrucciones) {
            let countMain = 0;
            if (instr instanceof Main_1.Main) {
                countMain++;
                if (countMain == 2) {
                    let error = new Errores_1.Errores("Semantico", "Existe mas de un metodo main", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                    break;
                }
                let value = instr.ejecutar(this.TSglobal, tree);
                if (value instanceof Break_1.Detener) {
                    let error = new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
                if (value instanceof Continuar_1.Continuar) {
                    let error = new Errores_1.Errores("Semantico", "Sentencia Continue fuera de Instruccion Ciclo", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
            }
            // instr.ejecutar(this.TSglobal, this);
        }
        ;
        // 3RA PASADA
        // VALIDACION FUERA DE MAIN
        for (let instr of this.instrucciones) {
            if (!(instr instanceof Declaracion_1.Declaracion || instr instanceof Asignacion_1.Asignacion || instr instanceof Main_1.Main || instr instanceof Funcion_1.Funcion || instr instanceof Struct_1.Struct || instr instanceof DeclaracionArr_1.DeclaracionArr || instr instanceof ModificacionArr_1.ModificacionArr)) {
                let error = new Errores_1.Errores("Semantico", "Sentencia Fuera de main", instr.fila, instr.columna);
                this.getErrores().push(error);
                this.updateConsolaPrintln(error.toString());
            }
        }
    }
    traducir() {
        let tree = this;
        tree.generadorC3d.clearCode();
        tree.setTSGlobal(this.TSglobal);
        // 1er recorrido
        //2
        this.instrucciones.forEach(instr => {
            instr.translate3d(this.TSglobal, tree);
        });
        let txtC3d = this.generadorC3d.getCode();
        // console.log(txtC3d)
        this.printInHtmlC3d(txtC3d);
        // this.generadorC3d.clearCode();
        return txtC3d;
    }
    printInHtmlC3d(cadena) {
        let textarea = document.querySelector('#textAreaC3d');
        let value = "";
        value += cadena;
        textarea.value = value;
    }
    getInstrucciones() {
        return this.instrucciones;
    }
    setInstrucciones(instrucciones) {
        this.instrucciones = instrucciones;
    }
    getErrores() {
        return this.Errores;
    }
    setErrores(excepciones) {
        this.Errores = excepciones;
    }
    addError(error) {
        this.Errores.concat(error);
        // this.updateConsola(error.toString());
    }
    getConsola() {
        return this.consola;
    }
    setConsola(consola) {
        this.consola = consola;
    }
    updateConsolaPrintln(cadena) {
        // console.log("cad println: " + cadena);
        this.consola += cadena + '\n';
        this.printInHtml(cadena + '\n');
    }
    updateConsolaPrint(cadena) {
        // console.log("cad print: " + cadena);
        // document.getElementById("textAreaConsola")
        this.consola += cadena;
        this.printInHtml(cadena);
    }
    printInHtml(cadena) {
        let textarea = document.querySelector('#textAreaConsola');
        let value = textarea.value;
        value += cadena;
        textarea.value = value;
    }
    getTSGlobal() {
        return this.TSglobal;
    }
    setTSGlobal(TSglobal) {
        this.TSglobal = TSglobal;
    }
    getFunction(name) {
        let tree = this;
        // console.log(name);
        // console.log(this.funciones);
        // this.funciones.forEach(function (func) {
        for (let func of tree.funciones) {
            // console.log(func);
            if (func.id == name) {
                return func;
            }
        }
        return null;
    }
    addFunction(funcion) {
        // console.log(funcion.id);
        this.funciones.push(funcion);
        // console.log(this.funciones)
        // console.log("entre funciont add");
    }
    getStruct(name) {
        let tree = this;
        // this.structs.forEach(struct => {
        for (let struct of tree.structs) {
            if (struct.id == name) {
                return struct;
            }
        }
        return null;
    }
    addStruct(struct) {
        this.structs.push(struct);
    }
    graphAst() {
        /**
         * ----AGREGANDO----
         * INSTRUCCIONES
         * START
         */
        let raiz = new Nodo_1.Nodo("START", "");
        let instrucciones = new Nodo_1.Nodo("INSTRUCCIONES", "");
        for (let inst of this.instrucciones) {
            instrucciones.addChildNode(inst.recorrer(this.TSglobal, this));
        }
        raiz.addChildNode(instrucciones);
        /**
         * -----RECORRIENDO----
         * >>> GRAFICANDO
         */
        this.dot = "";
        this.dot += "digraph {\n";
        this.dot += "n0[label=\"" + raiz.getToken().replace("\"", "") + "\"];\n";
        this.contador = 1;
        console.log(raiz);
        this.recorrer("n0", raiz);
        this.dot += "}";
        let textarea = document.querySelector('#textAreaConsola');
        let value = "";
        value += this.dot;
        textarea.value = value;
        return this.dot;
    }
    recorrer(idPadre, nodoPadre) {
        for (let nodo of nodoPadre.getChilds()) {
            // console.log(nodo);
            if (nodo instanceof Nodo_1.Nodo && nodo.getToken() != null) {
                let nameHijo = "n" + this.contador.toString();
                let token = nodo.getToken().toString().replace("\"", "");
                // console.log(token)
                this.dot += nameHijo + "[label=\"" + token + "\"];\n";
                this.dot += idPadre + "->" + nameHijo + ";\n";
                this.contador++;
                this.recorrer(nameHijo, nodo);
            }
        }
    }
}
exports.Ast = Ast;
