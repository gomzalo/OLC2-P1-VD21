import { Instruccion } from "../Interfaz/Instruccion";

export default class Ast  {
    public instrucciones:Array<Instruccion>;
    public funciones ;
    public structs ;
    public Errores ;
    public consola: string = "";
    public TSglobal =  null;
    public dot = "";
    public contador = 0;
    public strEntorno= "";


    constructor(){
        this.instrucciones = new Array<Instruccion>();
        this.funciones =  new Array();
        this.structs =  new Array();
        this.Errores = new Array();
        this.consola = "";
        this.TSglobal =  null;
        this.dot = "";
        this.contador = 0;
        this.strEntorno= "";
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
        this.consola += cadena + '\n'
    }

    public updateConsolaPrint(cadena){
        this.consola += cadena
    }

    public getTSGlobal(){
        return this.TSglobal;
    }

    public setTSGlobal(TSglobal){
        this.TSglobal = TSglobal;
    }

    public getFunction(name){
        this.funciones.forEach(function (func) {
            // console.log(func);
            if (func.name == name){
                return func;
            }
        }); 
        return null
    }

    public addFunction(funcion){
        this.funciones.concat(funcion);
    }

    public getStruct(name){
        this.structs.forEach(struct => {
            if (struct.id = name){
                return struct;
            }
        });
        return null;
    }

    public addStruct(struct){
        this.structs.concat(struct);
    }

    public getDot(raiz){
        
    }
}