"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Declaracion = void 0;
const Errores_1 = require("../Ast/Errores");
const Nodo_1 = require("../Ast/Nodo");
const Primitivo_1 = require("../Expresiones/Primitivo");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Declaracion {
    constructor(tipo, simbolos, fila, columna) {
        this.arreglo = false;
        // this.id = id;
        this.tipo = tipo;
        this.simbolos = simbolos;
        this.fila = fila;
        this.columna = columna;
        this.arreglo = false;
    }
    ejecutar(table, tree) {
        for (let simbolo of this.simbolos) {
            let variable = simbolo;
            // console.log(variable.id)
            if (variable.valor != null) {
                let valor = variable.valor.ejecutar(table, tree);
                //Verificando TIPOS de Variable
                let tipo_valor = variable.valor.tipo;
                // console.log("variable.valor.tipo: " + variable.valor.tipo);
                if (valor instanceof Errores_1.Errores) {
                    return valor;
                }
                if (tipo_valor == this.tipo || (this.tipo == Tipo_1.TIPO.DECIMAL && tipo_valor == Tipo_1.TIPO.ENTERO)) {
                    // console.log("entre tipo declaracion");
                    //--> Lo agregamos a la tabla de simbolos 
                    // console.log("SI tipo actual: " + tipo_valor + " tipo var es: " + this.tipo)
                    let nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, valor);
                    table.setSymbolTabla(nuevo_simb);
                }
                else {
                    // console.log("errorrr tipo declaracion");
                    console.log("NO tipo actual: " + tipo_valor + " tipo var es: " + this.tipo);
                    //Error no se puede declarar por incopatibilidad de simbolos
                    return new Errores_1.Errores("Semantico", "Declaracion " + variable.id + " -No coincide el tipo", simbolo.getFila(), simbolo.getColumna());
                }
            }
            else {
                //-- DECLARACION 1ERA VEZ -Se agrega a la tabla de simbolos 
                let nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, null);
                switch (this.tipo) {
                    case Tipo_1.TIPO.ENTERO:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, 0);
                        break;
                    case Tipo_1.TIPO.DECIMAL:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, 0.00);
                        break;
                    case Tipo_1.TIPO.CADENA:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, null);
                        break;
                    case Tipo_1.TIPO.BOOLEANO:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, false);
                        break;
                    case Tipo_1.TIPO.CHARACTER:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, '0');
                        break;
                    default:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, null);
                        break;
                }
                table.setSymbolTabla(nuevo_simb);
            }
        }
    }
    translate3d(table, tree) {
        var _a;
        // console.log("declaracion")
        const genc3d = tree.generadorC3d;
        for (let simbolo of this.simbolos) {
            let variable = simbolo;
            // console.log(variable.id)
            let valor = (_a = variable.valor) === null || _a === void 0 ? void 0 : _a.translate3d(table, tree);
            //1 Si se crea por primera vez
            if (valor == null) {
                genc3d.gen_Comment("------- Default primitivo Declaracion-------");
                if (this.tipo == Tipo_1.TIPO.DECIMAL) {
                    let primitivo = new Primitivo_1.Primitivo(0, Tipo_1.TIPO.DECIMAL, this.fila, this.columna);
                    valor = primitivo.translate3d(table, tree);
                }
                if (this.tipo == Tipo_1.TIPO.ENTERO) {
                    let primitivo = new Primitivo_1.Primitivo(0, Tipo_1.TIPO.ENTERO, this.fila, this.columna);
                    valor = primitivo.translate3d(table, tree);
                }
                if (this.tipo == Tipo_1.TIPO.CADENA) {
                    let primitivo = new Primitivo_1.Primitivo("null", Tipo_1.TIPO.CADENA, this.fila, this.columna);
                    valor = primitivo.translate3d(table, tree);
                }
                if (this.tipo == Tipo_1.TIPO.BOOLEANO) {
                    let primitivo = new Primitivo_1.Primitivo(false, Tipo_1.TIPO.BOOLEANO, this.fila, this.columna);
                    valor = primitivo.translate3d(table, tree);
                }
                if (this.tipo == Tipo_1.TIPO.CHARACTER) {
                    let primitivo = new Primitivo_1.Primitivo("0", Tipo_1.TIPO.CHARACTER, this.fila, this.columna);
                    valor = primitivo.translate3d(table, tree);
                }
                /// arreglos en clase arreglo
            }
            // console.log(valor)
            // console.log("while tipos:");
            // console.log(this.tipo);
            // console.log(valor.tipo);
            // console.log(!(this.tipo == TIPO.DECIMAL && valor.tipo == TIPO.ENTERO));
            if (this.tipo == valor.tipo || (this.tipo == Tipo_1.TIPO.DECIMAL && valor.tipo == Tipo_1.TIPO.ENTERO)) {
                // Verificar si guardar
                let nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, "");
                // console.log(nuevo_simb);
                // nuevo_simb.isRef=true;
                nuevo_simb.posicion = table.size;
                let res_simb = table.setSymbolTabla(nuevo_simb);
                if (res_simb instanceof Errores_1.Errores) {
                    tree.updateConsolaPrintln(res_simb.toString());
                    return;
                }
                genc3d.gen_Comment("------- Declarando-------");
                ///array en declaracion array
                if (nuevo_simb.isGlobal) {
                    if (valor.tipo === Tipo_1.TIPO.BOOLEANO) {
                        genc3d.gen_Comment("------- is ref true -------");
                        const lbl = genc3d.newLabel();
                        genc3d.gen_Label(valor.lblTrue);
                        genc3d.gen_SetStack(nuevo_simb.posicion, '1');
                        genc3d.gen_Goto(lbl);
                        genc3d.gen_Label(valor.lblFalse);
                        genc3d.gen_SetStack(nuevo_simb.posicion, '0');
                        genc3d.gen_Label(lbl);
                    }
                    else
                        genc3d.gen_SetStack(nuevo_simb.posicion, valor.valor);
                }
                else {
                    genc3d.gen_Comment("------- is ref false -------");
                    const temp = genc3d.newTemp();
                    genc3d.freeTemp(temp);
                    genc3d.gen_Exp(temp, 'p', nuevo_simb.posicion, '+');
                    if (valor.tipo === Tipo_1.TIPO.BOOLEANO) {
                        const lbl = genc3d.newLabel();
                        genc3d.gen_Label(valor.lblTrue);
                        genc3d.gen_SetStack(nuevo_simb.posicion, '1');
                        genc3d.gen_Goto(lbl);
                        genc3d.gen_Label(valor.lblFalse);
                        genc3d.gen_SetStack(nuevo_simb.posicion, '0');
                        genc3d.gen_Label(lbl);
                    }
                    else
                        genc3d.gen_SetStack(temp, valor.valor);
                }
            }
            else {
                let error = new Errores_1.Errores("\nC3D ", `Declaracion, variable con ID: "${variable.id}", no coincide el tipo.`, simbolo.getFila(), simbolo.getColumna());
                tree.updateConsolaPrintln(error.toString());
                tree.Errores.push(error);
                return error;
            }
        }
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("DECLARACION", "");
        for (let sim of this.simbolos) {
            padre.addChildNode(new Nodo_1.Nodo(sim.id, ""));
        }
        return padre;
    }
}
exports.Declaracion = Declaracion;
