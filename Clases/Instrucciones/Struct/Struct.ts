import { Ast } from "../../Ast/Ast";
import { Errores } from "../../Ast/Errores";
import { DeclaracionArr } from "../Arreglos/DeclaracionArr";
import { Asignacion } from "../Asignacion";
import { Declaracion } from "../Declaracion";
import { Detener } from "../Transferencia/Break";
import { Continuar } from "../Transferencia/Continuar";
import { Return } from "../Transferencia/Return";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import { Simbolo } from "../../TablaSimbolos/Simbolo";
import { DeclararStruct } from "./DeclararStruct";

export class Struct implements Instruccion{
    fila: number;
    columna: number;
    arreglo: boolean;
    public id: string;
    public idSimbolo :string;
    public tipo : TIPO;
    public attributes: TablaSimbolos;
    public instructions: Array<Instruccion|any>;
    public variables :Array<any>;

    constructor(id,instructions,fila,columna){
        this.id = id;
        this.idSimbolo = "";
        this.fila = fila;
        this.columna =columna;
        this.attributes = new TablaSimbolos(null);
        this.instructions =instructions;
        this.tipo = TIPO.STRUCT;
        this.variables = new Array();
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        
        console.log(this.instructions);
        for(let instr of this.instructions)
        {
            
            let result = null;
            // Validando Declaraciones Asignaciones 
            if (instr instanceof Declaracion /*|| instr instanceof Asignacion */|| instr instanceof DeclaracionArr || instr instanceof DeclararStruct/**AGREGAR DECLA STRUCT */)
            {
                console.log(instr);
                result = instr.ejecutar(this.attributes,tree);
                if (instr instanceof Declaracion){
                    for(let simbolo of instr.simbolos){
                        tree.updateConsolaPrintln(" simbolo: " + simbolo.id);
                        this.variables.push({"tipo" : instr.tipo, "arreglo": false, "id": simbolo.id});
                    }
                }
                if (instr instanceof DeclararStruct){

                }
            }
            // Validando Errores
            if (result instanceof Errores)
            {
                let error = new Errores("Semantico", "Struct - Error en Atributos Struct ", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrint(error.toString()+"/n/t->/t");
                return result;
            }
            if( result instanceof Detener ){
                let error = new Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
            }
            if( result instanceof Continuar){
                let error = new Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
            }
            if( result instanceof Return){
                let error = new Errores("Semantico", "Sentencia Return fuera de Metodo/Funciones/Controlador", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
                // this.tipo = result.tipo;
                // return result.valor;
            }
        }
        // Guardo Simbolo: id, tipoStruct(el Struct que es), TIPO.STRUCT, variables, Attributes: TablaSimbolos(null)
        let nuevo_simb = new Simbolo(this.idSimbolo, this.tipo, false, this.fila, this.columna, this.attributes);
        nuevo_simb.tipoStruct = this.id;
        nuevo_simb.variables = this.variables;
        tree.updateConsolaPrintln(" tamano variables: struct; " + this.variables.length);
        tree.updateConsolaPrintln(" tamano instruccines: struct; " + this.instructions.length);
        table.setSymbolTabla(nuevo_simb);
        return nuevo_simb;
        
    }

    ejecutarUpdate(table: TablaSimbolos, tree: Ast) {
        

        for(let instr of this.instructions)
        {
            
            let result = null;
            // Validando Declaraciones Asignaciones 
            if (instr instanceof Declaracion || instr instanceof Asignacion || instr instanceof DeclaracionArr || DeclararStruct/**AGREGAR DECLA STRUCT */)
            {
                result = instr.ejecutar(this.attributes,tree);
                if (instr instanceof Declaracion){
                    for(let simbolo of instr.simbolos){
                        this.variables.push({"tipo" : instr.tipo, "arreglo": false, "id": simbolo.id});
                    }
                }
            }
            // Validando Errores
            if (result instanceof Errores)
            {
                let error = new Errores("Semantico", "Struct - Error en Atributos Struct ", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrint(error.toString()+"/n/t->/t");
                return result;
            }
            if( result instanceof Detener ){
                let error = new Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
            }
            if( result instanceof Continuar){
                let error = new Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
            }
            if( result instanceof Return){
                let error = new Errores("Semantico", "Sentencia Return fuera de Metodo/Funciones/Controlador", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
                // this.tipo = result.tipo;
                // return result.valor;
            }
        }
        // Guardo Simbolo: id, tipoStruct(el Struct que es), TIPO.STRUCT, variables, Attributes: TablaSimbolos(null)
        let nuevo_simb = new Simbolo(this.idSimbolo, this.tipo, false, this.fila, this.columna, this.attributes);
        nuevo_simb.tipoStruct = this.id;
        nuevo_simb.variables = this.variables;
        table.setSymbolTabla(nuevo_simb);
        
    }

    getTipoStruct()
    {
        return this.id;
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

}