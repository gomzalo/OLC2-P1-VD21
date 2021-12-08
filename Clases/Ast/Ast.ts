import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";

export class Ast  {
    public instrucciones:Array<Instruccion>;
    public funciones ;
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
        this.TSglobal =  null;
        this.dot = "";
        this.contador = 0;
        this.strEntorno= "";
    }

    // public ejecutar(table: TablaSimbolos, tree: Ast){
    //     // 1ERA PASADA: 
    //     // GUARDAR FUNCIONES  Y METODOS
    //     // for( let instr of this.instrucciones){

    //     // }

    //     // 2DA PASADA
    //     // EJECUTAMOS TODAS LAS FUNCIONES
    //     this.instrucciones.forEach(instruccion => {
    //         instruccion.ejecutar(table, tree);
    //     });
    // }

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
        this.funciones.forEach(function (func) {
            // console.log(func);
            if (func.name == name){
                return func;
            }
        }); 
        return null;
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

    // public getDot(raiz){
        
    // }
}