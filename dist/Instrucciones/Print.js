"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
const Errores_1 = require("../Ast/Errores");
const Nodo_1 = require("../Ast/Nodo");
const Retorno_1 = require("../G3D/Retorno");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Return_1 = require("./Transferencia/Return");
class Print {
    constructor(parametros, fila, columna, tipo) {
        this.parametros = parametros;
        this.fila = fila;
        this.columna = columna;
        this.tipo = tipo;
    }
    ejecutar(table, tree) {
        //TODO: verificar que el tipo del valor sea primitivo
        this.value = "";
        for (let expresion of this.parametros) {
            let valor = expresion.ejecutar(table, tree);
            // console.log("print exp val: " + String(valor));
            // console.log(valor);
            // Validaciones de TIPOS A Imprimir
            if (valor instanceof Errores_1.Errores) {
                return valor;
            }
            if (valor instanceof Simbolo_1.Simbolo && valor.tipo == Tipo_1.TIPO.STRUCT) {
                let temp;
                temp = valor;
                // console.log("print STRUCT");
                // console.log(valor);
                valor = temp.toStringStruct();
            }
            if (expresion.tipo == Tipo_1.TIPO.ARREGLO) {
            }
            if (valor instanceof Return_1.Return) {
                let temp;
                temp = valor;
                valor = temp.valor;
                // validar si es un struct
            }
            this.value += valor;
            // return null;    
        }
        if (this.tipo) {
            // this.value += valor.toString() + "\n";
            (this.value != null) ? tree.updateConsolaPrintln(String(this.value)) : tree.updateConsolaPrintln("null");
            // tree.updateConsolaPrintln(String(valor))
        }
        else {
            // this.value += valor.toString();
            (this.value != null) ? tree.updateConsolaPrint(String(this.value)) : tree.updateConsolaPrint("null");
            // tree.updateConsolaPrint(String(valor))
        }
        return null;
    }
    translate3d(table, tree) {
        const genc3d = tree.generadorC3d;
        this.parametros.forEach(expresion => {
            let valor3d = expresion.translate3d(table, tree);
            if (valor3d instanceof Retorno_1.Retorno) {
                // console.log(valor3d)
                let temp = valor3d.translate3d();
                let t0 = genc3d.newTemp();
                if (valor3d.tipo == Tipo_1.TIPO.CADENA) {
                    genc3d.gen_Comment('--------- INICIA PRINT CADENA ---------');
                    genc3d.gen_SetStack(t0, temp);
                    genc3d.gen_Call('natPrintStr');
                    // genc3d.gen_Code('');
                    genc3d.gen_Comment('--------- FIN PRINT CADENA ---------');
                }
                else if (valor3d.tipo == Tipo_1.TIPO.ENTERO) {
                    genc3d.gen_Comment('--------- INICIA PRINT INT ---------');
                    genc3d.gen_Print('i', temp);
                    genc3d.gen_Comment('--------- FIN PRINT INT ---------');
                }
                else if (valor3d.tipo == Tipo_1.TIPO.DECIMAL) {
                    genc3d.gen_Comment('--------- INICIA PRINT DOUBLE ---------');
                    genc3d.gen_Print('f', temp);
                    genc3d.gen_Comment('--------- FIN PRINT DOUBLE ---------');
                }
                else if (valor3d.tipo == Tipo_1.TIPO.BOOLEANO) {
                    let salida = genc3d.newLabel();
                    genc3d.gen_Comment('--------- INICIA PRINT FALSE ---------');
                    genc3d.gen_Label(valor3d.lblFalse);
                    genc3d.gen_PrintFalse();
                    genc3d.gen_Goto(salida);
                    genc3d.gen_Comment('--------- INICIA PRINT TRUE ---------');
                    genc3d.gen_Label(valor3d.lblTrue);
                    genc3d.gen_PrintTrue();
                    genc3d.gen_Goto(salida);
                    genc3d.gen_Label(salida);
                }
                if (this.tipo) {
                    genc3d.gen_Print('c', '10');
                }
            }
        });
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("Print", "");
        // padre.addChildNode(new Nodo("print",""));
        // padre.addChildNode(new Nodo("(",""));
        let hijo = new Nodo_1.Nodo("EXPRESIONES", "");
        for (let par of this.parametros) {
            hijo.addChildNode(par.recorrer(table, tree));
        }
        padre.addChildNode(hijo);
        // padre.addChildNode(new Nodo(")",""));
        return padre;
    }
}
exports.Print = Print;
