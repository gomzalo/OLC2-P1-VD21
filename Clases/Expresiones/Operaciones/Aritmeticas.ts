import {Ast} from "../../Ast/Ast"
import {Errores} from "../../Ast/Errores";
import {Nodo} from "../../Ast/Nodo";
// import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO, OperadorAritmetico } from "../../TablaSimbolos/Tipo";


export class Aritmetica implements Instruccion {
    public exp1: any;
    public operador: OperadorAritmetico;
    public exp2: any;
    public fila: number;
    public columna: number;
    public expU: any;
    public tipo : TIPO;

    public constructor(exp1, operador, exp2, fila, columna, expU ) {
        this.exp1 = exp1;
        this.operador = operador;
        this.exp2 = exp2;
        this.fila = fila;
        this.columna = columna;
        this.expU = expU;
        this.tipo = null;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        let tipoGeneral;
        
        if(this.expU == false){
            valor_exp1 = this.exp1.ejecutar(tree, table);
            valor_exp2 = this.exp2.ejecutar(tree, table);
            tipoGeneral = this.getTipoMax(this.exp1.tipo, this.exp2.tipo);
        }else{
            valor_expU = this.exp1.ejecutar(tree, table);
        }



        /**
         * Para las siguientes validaciones nos basamos en la tabla de 
         * de las operaciones aritmeticas permitidas que soporta el lenguaje descrito en el enunciado.
         */
        switch (this.operador) {
            case OperadorAritmetico.MAS:
                if (tipoGeneral == TIPO.CADENA){
                    // this.tipo = TIPO.CADENA;
                    // return valor_exp1.toString() + valor_exp2.toString();
                    return new Errores("Semantico", "Suma - Error de tipos STRING, no concatenable", this.fila, this.columna);
                }
                else if(tipoGeneral == TIPO.BOOLEANO)
                {
                    return new Errores("Semantico", "Suma - Error de tipo booleano", this.fila, this.columna);
                }
                else if (tipoGeneral == TIPO.CHARACTER)
                {
                    if (this.exp1.tipo == TIPO.ENTERO )
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1 + valor_exp2.charCodeAt(0);
                    }
                    else if(this.exp2.tipo == TIPO.ENTERO)
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) + valor_exp2;
                    }
                    else if (this.exp1.tipo == TIPO.DECIMAL )
                    {
                        this.tipo = TIPO.DECIMAL;
                        return valor_exp1 + valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == TIPO.DECIMAL )
                    {
                        this.tipo = TIPO.DECIMAL;
                        return valor_exp1.charCodeAt(0) + valor_exp2;
                    }
                    else if (this.exp1.tipo == TIPO.CHARACTER && this.exp2.tipo == TIPO.CHARACTER)
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) + valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp1.tipo == TIPO.CHARACTER )
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1 + valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == TIPO.CHARACTER )
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) + valor_exp2;
                    }
                    else{
                        return new Errores("Semantico", "Suma - Error de tipo ", this.fila, this.columna);
                    }
                }
                else if (tipoGeneral == TIPO.DECIMAL)
                {
                    this.tipo = TIPO.DECIMAL;
                    return valor_exp1 + valor_exp2;
                }
                else if (tipoGeneral == TIPO.ENTERO)
                {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1 + valor_exp2;
                }else{
                    return new Errores("Semantico", "Suma - Error de tipo ", this.fila, this.columna);
                }
                
                break;

            case OperadorAritmetico.UMENOS:
                if(this.exp1.tipo == TIPO.ENTERO || this.exp1.tipo == TIPO.DECIMAL){
                    return -valor_expU;
                }else{
                    return new Errores("Semantico", "UNARIO - Error de tipo ", this.fila, this.columna);
                }
                break;
            case OperadorAritmetico.MENOS:
                if (tipoGeneral == TIPO.CHARACTER)
                {
                    if (this.exp1.tipo == TIPO.ENTERO )
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1 - valor_exp2.charCodeAt(0);
                    }
                    else if(this.exp2.tipo == TIPO.ENTERO)
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) - valor_exp2;
                    }
                    else if (this.exp1.tipo == TIPO.DECIMAL )
                    {
                        this.tipo = TIPO.DECIMAL;
                        return valor_exp1 - valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == TIPO.DECIMAL )
                    {
                        this.tipo = TIPO.DECIMAL;
                        return valor_exp1.charCodeAt(0) - valor_exp2;
                    }
                    else if (this.exp1.tipo == TIPO.CHARACTER && this.exp2.tipo == TIPO.CHARACTER)
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) - valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp1.tipo == TIPO.CHARACTER )
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1 - valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == TIPO.CHARACTER )
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) - valor_exp2;
                    }
                    else{
                        return new Errores("Semantico", "Resta - Error de tipo ", this.fila, this.columna);
                    }
                }
                else if (tipoGeneral == TIPO.DECIMAL)
                {
                    this.tipo = TIPO.DECIMAL;
                    return valor_exp1 - valor_exp2;
                }
                else if (tipoGeneral == TIPO.ENTERO)
                {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1 - valor_exp2;
                }else{
                    return new Errores("Semantico", "Resta - Error de tipo ", this.fila, this.columna);
                }
            
                break;
            case OperadorAritmetico.POR:
                if (tipoGeneral == TIPO.CHARACTER)
                {
                    if (this.exp1.tipo == TIPO.ENTERO )
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1 * valor_exp2.charCodeAt(0);
                    }
                    else if(this.exp2.tipo == TIPO.ENTERO)
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) * valor_exp2;
                    }
                    else if (this.exp1.tipo == TIPO.DECIMAL )
                    {
                        this.tipo = TIPO.DECIMAL;
                        return valor_exp1 * valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == TIPO.DECIMAL )
                    {
                        this.tipo = TIPO.DECIMAL;
                        return valor_exp1.charCodeAt(0) * valor_exp2;
                    }
                    else if (this.exp1.tipo == TIPO.CHARACTER && this.exp2.tipo == TIPO.CHARACTER)
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) * valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp1.tipo == TIPO.CHARACTER )
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1 * valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == TIPO.CHARACTER )
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) * valor_exp2;
                    }
                    else{
                        return new Errores("Semantico", "POR - Error de tipo ", this.fila, this.columna);
                    }
                }
                else if (tipoGeneral == TIPO.DECIMAL)
                {
                    this.tipo = TIPO.DECIMAL;
                    return valor_exp1 * valor_exp2;
                }
                else if (tipoGeneral == TIPO.ENTERO)
                {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1 * valor_exp2;
                }else{
                    return new Errores("Semantico", "POR - Error de tipo ", this.fila, this.columna);
                }
                    break;  
            case OperadorAritmetico.DIV:
                if (tipoGeneral == TIPO.CHARACTER)
                {
                    if (this.exp1.tipo == TIPO.ENTERO )
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1 / valor_exp2.charCodeAt(0);
                    }
                    else if(this.exp2.tipo == TIPO.ENTERO)
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) / valor_exp2;
                    }
                    else if (this.exp1.tipo == TIPO.DECIMAL )
                    {
                        this.tipo = TIPO.DECIMAL;
                        return valor_exp1 / valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == TIPO.DECIMAL )
                    {
                        this.tipo = TIPO.DECIMAL;
                        return valor_exp1.charCodeAt(0) / valor_exp2;
                    }
                    else if (this.exp1.tipo == TIPO.CHARACTER && this.exp2.tipo == TIPO.CHARACTER)
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) / valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp1.tipo == TIPO.CHARACTER )
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1 / valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == TIPO.CHARACTER )
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) / valor_exp2;
                    }
                    else{
                        return new Errores("Semantico", "DIV - Error de tipo ", this.fila, this.columna);
                    }
                }
                else if (tipoGeneral == TIPO.DECIMAL)
                {
                    this.tipo = TIPO.DECIMAL;
                    return valor_exp1 / valor_exp2;
                }
                else if (tipoGeneral == TIPO.ENTERO)
                {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1 / valor_exp2;
                }else{
                    return new Errores("Semantico", "DIV - Error de tipo ", this.fila, this.columna);
                }
                break;
            case OperadorAritmetico.MOD:
                if (tipoGeneral == TIPO.CHARACTER)
                {
                    if (this.exp1.tipo == TIPO.ENTERO )
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1 % valor_exp2.charCodeAt(0);
                    }
                    else if(this.exp2.tipo == TIPO.ENTERO)
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) % valor_exp2;
                    }
                    else if (this.exp1.tipo == TIPO.DECIMAL )
                    {
                        this.tipo = TIPO.DECIMAL;
                        return valor_exp1 % valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == TIPO.DECIMAL )
                    {
                        this.tipo = TIPO.DECIMAL;
                        return valor_exp1.charCodeAt(0) % valor_exp2;
                    }
                    else if (this.exp1.tipo == TIPO.CHARACTER && this.exp2.tipo == TIPO.CHARACTER)
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) % valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp1.tipo == TIPO.CHARACTER )
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1 % valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == TIPO.CHARACTER )
                    {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) % valor_exp2;
                    }
                    else{
                        return new Errores("Semantico", "MOD - Error de tipo ", this.fila, this.columna);
                    }
                }
                else if (tipoGeneral == TIPO.DECIMAL)
                {
                    this.tipo = TIPO.DECIMAL;
                    return valor_exp1 % valor_exp2;
                }
                else if (tipoGeneral == TIPO.ENTERO)
                {
                        this.tipo = TIPO.ENTERO;
                        return valor_exp1 % valor_exp2;
                }else{
                    return new Errores("Semantico", "MOD - Error de tipo ", this.fila, this.columna);
                }
                break;
            case OperadorAritmetico.POT:
                if (this.exp1.tipo == TIPO.CADENA && this.exp2.tipo == TIPO.ENTERO ){
                    this.tipo = TIPO.CADENA;
                    return valor_exp1.toString().repeat(valor_exp2);
                }else{
                    return new Errores("Semantico", "POTENCIA - Error de tipo ", this.fila, this.columna);
                }
                break;
            case OperadorAritmetico.AMPERSON:
                    if (this.exp1.tipo == TIPO.CADENA && this.exp2.tipo == TIPO.CADENA ){
                        this.tipo = TIPO.CADENA;
                        return valor_exp1.toString() + valor_exp2.toString()
                    }else{
                        return new Errores("Semantico", "Concatenacion - Error de tipo ", this.fila, this.columna);
                    }
                    // if(typeof valor_exp1 === 'number'){
                    //     if(typeof valor_exp2 === 'number'){
                    //         return Math.pow(valor_exp1, valor_exp2);
                    //     }
                    // }
                    break;
            //TODO: Agregar otros casos de aritmeticas (POTENCIA, MODULO)
            default:
                //TODO: agregar errror que ser produjo algo inesperado.
                break;
        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

    getTipo(ts: TablaSimbolos, ast: Ast) : TIPO{
        let valor = this.ejecutar(ts, ast);

        if(typeof valor === 'number'){   
            return TIPO.DECIMAL;
        }else if(typeof valor === 'string'){
            return TIPO.CADENA;
        }else if(typeof valor === 'boolean'){
            return TIPO.BOOLEANO;
        }
    }

    getTipoMax(tipoIzq, tipoDer){
        if (tipoIzq == TIPO.NULO || tipoDer == TIPO.NULO){
            return TIPO.NULO
        }
        if (tipoIzq == TIPO.CADENA || tipoDer == TIPO.CADENA){
            return TIPO.CADENA
        }
        if (tipoIzq == TIPO.CHARACTER || tipoDer == TIPO.CHARACTER){
            return TIPO.CADENA
        }
        if (tipoIzq == TIPO.BOOLEANO || tipoDer == TIPO.BOOLEANO){
            return TIPO.BOOLEANO
        }
        if (tipoIzq == TIPO.DECIMAL || tipoDer == TIPO.DECIMAL){
            return TIPO.DECIMAL
        }
        if (tipoIzq == TIPO.ENTERO || tipoDer == TIPO.ENTERO){
            return TIPO.ENTERO
        }
    }

    
    recorrer(): Nodo {
        let padre = new Nodo("Exp. Aritmetica","");

        if(this.expU){
            padre.addChildNode(new Nodo(this.operador.toString(),""));
            padre.addChildNode(this.exp1.recorrer());
        }else{
            padre.addChildNode(this.exp1.recorrer());
            padre.addChildNode(new Nodo(this.operador.toString(),""));
            padre.addChildNode(this.exp2.recorrer());
        }
        return padre;
    }

    getValor(tipo, valor){
        // if (tipo == TIPO.ENTERO){
        //     return valor.valueOf()
        // }
        // else if (tipo == TIPO.DECIMAL){
        //     return valor.valueOf()
        // }
        // else if (tipo == TIPO.BOOLEANO){
        //     return bool(valor)
        // }
        // else if (tipo == TIPO.CHARACTER){
        //     return str(valor)
        // }
        // else if (tipo == TIPO.CADENA){
        //     return str(valor)
        // }
    }
}