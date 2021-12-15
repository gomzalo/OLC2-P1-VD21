"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoStruct = void 0;
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
const Struct_1 = require("../../Instrucciones/Struct/Struct");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Identificador_1 = require("../Identificador");
class AccesoStruct {
    constructor(idStruct, expresiones, fila, columna) {
        this.idStruct = idStruct;
        this.expresiones = expresiones;
        this.fila = fila,
            this.columna = columna;
        this.tipo = Tipo_1.TIPO.STRUCT;
    }
    ejecutar(table, tree) {
        if (!(this.idStruct instanceof Identificador_1.Identificador)) {
            return new Errores_1.Errores("Semantico", "AccesoStruct " + this.id + " NO es TIPO ID", this.fila, this.columna);
        }
        console.log("acceso");
        let simboloStruct = this.idStruct.ejecutar(table, tree);
        // this.id= this.idStruct.id; 
        if (simboloStruct == null) {
            return new Errores_1.Errores("Semantico", "AccesoStruct " + this.idStruct.id + " NO coincide con la busqueda Struct", this.fila, this.columna);
        }
        // if (simboloStruct.tipo != TIPO.STRUCT)
        // {
        //     return new Errores("Semantico", "Struct " + this.id + " NO es TIPO STRUCT", this.fila, this.columna);
        // }
        // Acceso atributos
        // let value = this.accesoAttribute(this.expresiones, simboloStruct.valor)
        console.log(this.idStruct);
        console.log(this.expresiones);
        console.log(simboloStruct);
        if (!(this.expresiones instanceof Identificador_1.Identificador || this.expresiones instanceof AccesoStruct || this.expresiones instanceof Struct_1.Struct)) {
            return new Errores_1.Errores("Semantico", "AccesoStruct " + this.id + " NO es TIPO Identificador/AccesoStruct/Struct", this.fila, this.columna);
        }
        if (!(simboloStruct.valor instanceof TablaSimbolos_1.TablaSimbolos)) {
            return new Errores_1.Errores("Semantico", "AccesoStruct " + this.id + " NO es TIPO Identificador/AccesoStruct/Struct", this.fila, this.columna);
        }
        let resultAcceso = this.expresiones.ejecutar(simboloStruct.valor, tree);
        return resultAcceso;
        // let entornoAttributes = simboloStruct.getValor();
        // if (this.expresiones.expresiones.length >0)
        // {
        //     return this.accesoAttribute(this.expresiones.expresiones,entornoAttributes,tree);
        // }else{
        //     return null;
        // }
        // let valueId = null;
        // for (let expr of this.expresiones)
        // {
        //     return valueId = expr.ejecutar(entornoAttributes,tree);
        // }
    }
    accesoAttribute(expresion, entornoPadre, tree) {
        // let entornoAttributes = null;
        // if (expresion.tipo == TIPO.STRUCT)
        // {
        //     entornoAttributes = entorno.getValor();
        // }
        if (entornoPadre == null) {
            return new Errores_1.Errores("Semantico", "Acceso Atributo Struct: " + this.id + ", no encontrado", this.fila, this.columna);
            ;
        }
        else {
            let resultIdentificador = expresion.identificador.ejecutar(entornoPadre, tree); //TablaSimbolos || resultado
            //recomiendo su array de expresiones
            if (resultIdentificador instanceof TablaSimbolos_1.TablaSimbolos && expresion.expresiones.length > 0) {
                // 2 if is TablasSimbolos
                return this.accesoAttribute(expresion.expresiones, resultIdentificador, tree);
            }
            else {
                //error
                if (resultIdentificador instanceof Errores_1.Errores) {
                    return resultIdentificador;
                }
                return resultIdentificador;
            }
            // if (value instanceof Errores)
            // {
            //     tree.getErrores().push(result);
            //     tree.updateConsolaPrintln(result.toString());
            // }
            // if (result instanceof Identificador)
            // {
            //     if (result.tipo == TIPO.STRUCT){}
            //     {
            //     }
            // }
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("ACCESO STRUCT", "");
        if (this.idStruct != null) {
            padre.addChildNode(this.idStruct.recorrer(table, tree));
        }
        if (this.expresiones != null) {
            padre.addChildNode(this.expresiones.recorrer(table, tree));
        }
        return padre;
    }
}
exports.AccesoStruct = AccesoStruct;
