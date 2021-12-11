import { Asignacion } from "../Instrucciones/Asignacion";
import { Declaracion } from "../Instrucciones/Declaracion";
import { Main } from "../Instrucciones/Metodos/Main";
import { Funcion } from "../Instrucciones/Metodos/Funcion";
import { Detener } from "../Instrucciones/Transferencia/Break";
import { Continuar } from "../Instrucciones/Transferencia/Continuar";
import { Return } from "../Instrucciones/Transferencia/Return";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { Errores } from "./Errores";
import { Struct } from "../Instrucciones/Struct/Struct";

export class Ast  {
    public instrucciones:Array<Instruccion>;
    public funciones:Array<any> ;
    public structs ;
    public Errores ;
    public consola: string = "";
    public TSglobal : TablaSimbolos =  null;
    public dot : string = "";
    public contador : number = 0;
    public strEntorno : string = "";


    constructor(){
        this.instrucciones = new Array<Instruccion>();
        this.funciones =  new Array();
        this.structs =  new Array();
        this.Errores = new Array();
        this.consola = "";
        // this.TSglobal =  null;
        this.dot = "";
        this.contador = 0;
        this.strEntorno= "";
        this.TSglobal = new TablaSimbolos(null);
    }

    public ejecutar(){
        let tree =this;
        // 1ERA PASADA: 
        // GUARDAR FUNCIONES  Y METODOS
        for( let instr of this.instrucciones){
            let value = null;
            if (instr instanceof Funcion )
            {
                this.addFunction(instr);
            }
            if (instr instanceof Struct )
            {
                this.addStruct(instr);
            }
            if (value instanceof Declaracion || value instanceof Asignacion )
            {
                value = instr.ejecutar(this.TSglobal,tree);
            }
            
            if (value instanceof Errores)
            {
                this.getErrores().push(value);
                this.updateConsolaPrintln(value.toString());
            }
            if( value instanceof Detener ){
                let error = new Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", instr.fila, instr.columna);
                this.getErrores().push(error);
                this.updateConsolaPrintln(error.toString());
            }
            if( value instanceof Continuar){
                let error = new Errores("Semantico", "Sentencia Continue fuera de Instruccion Ciclo", instr.fila, instr.columna);
                this.getErrores().push(error);
                this.updateConsolaPrintln(error.toString());
            }
            if( value instanceof Return){
                let error = new Errores("Semantico", "Sentencia Return fuera de Metodos/Control/Ciclos", instr.fila, instr.columna);
                this.getErrores().push(error);
                this.updateConsolaPrintln(error.toString());
            }
        }

        // 2DA PASADA
        // EJECUTAMOS TODAS LAS FUNCIONES
        for( let instr of this.instrucciones){
            let countMain = 0;
            if (instr instanceof Main)
            {
                countMain++;
                if (countMain>2)
                {
                    let error = new Errores("Semantico", "Existe mas de un metodo main", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                    break;
                }
                let value = instr.ejecutar(this.TSglobal,tree);

            }
            // instr.ejecutar(this.TSglobal, this);
        };

        // 3RA PASADA
        // VALIDACION FUERA DE MAIN
        for( let instr of this.instrucciones){
            if (!(instr instanceof Declaracion || instr instanceof Asignacion || instr instanceof Main || instr instanceof Funcion || instr instanceof Struct))
            {
                let error = new Errores("Semantico", "Sentencia Fuera de main", instr.fila, instr.columna);
                this.getErrores().push(error);
                this.updateConsolaPrintln(error.toString());
            }
        }

    }

    public getInstrucciones(){
        return this.instrucciones;
    }

    public setInstrucciones(instrucciones){
        this.instrucciones = instrucciones;
    }

    public getErrores(){
        return this.Errores;
    }

    public setErrores(excepciones){
        this.Errores = excepciones;
    }

    public addError(error){
        this.Errores.concat(error);
        // this.updateConsola(error.toString());
    }

    public getConsola(){
        return this.consola;
    }

    public setConsola(consola){
        this.consola = consola;
    }

    public updateConsolaPrintln(cadena: string){
        // console.log("cad println: " + cadena);
        this.consola += cadena + '\n';
        
    }

    public updateConsolaPrint(cadena: string){
        // console.log("cad print: " + cadena);
        this.consola += cadena;
    }

    public getTSGlobal(){
        return this.TSglobal;
    }

    public setTSGlobal(TSglobal){
        this.TSglobal = TSglobal;
    }

    public getFunction(name){
        let tree =this;
        console.log(name);
        console.log(this.funciones);
        // this.funciones.forEach(function (func) {
        for(let func of tree.funciones){
            // console.log(func);
            if (func.id == name){
                return func;
            }
        }
        return null;
    }

    public addFunction(funcion){
        console.log(funcion.id);
        this.funciones.push(funcion);
        console.log(this.funciones)
        console.log("entre funciont add");
    }

    public getStruct(name){
        let tree =this;
        // this.structs.forEach(struct => {
        for(let struct of tree.structs){
            if (struct.id = name){
                return struct;
            }
        }
        return null;
    }

    public addStruct(struct){
        this.structs.push(struct);
    }

    // public getDot(raiz){
        
    // }
}