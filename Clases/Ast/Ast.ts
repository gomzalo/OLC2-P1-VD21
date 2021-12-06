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

    public setErrores(){
        
    }
}