import { Ast } from "../../Ast/Ast"
import { Errores} from "../../Ast/Errores";
import { Nodo } from "../../Ast/Nodo";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO, OperadorAritmetico } from "../../TablaSimbolos/Tipo";
import { Retorno } from "../../G3D/Retorno";

export class Aritmetica implements Instruccion {
    public exp1: any;
    public operador: OperadorAritmetico;
    public exp2: any;
    public fila: number;
    public columna: number;
    public expU: any;
    public tipo : TIPO;
    arreglo: boolean;

    public constructor(exp1, operador, exp2, fila, columna, expU ) {
        this.exp1 = exp1;
        this.operador = operador;
        this.exp2 = exp2;
        this.fila = fila;
        this.columna = columna;
        this.expU = expU;
        this.tipo = null;
    }
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //      :::::::::::::::::::::    EJECUTAR      :::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ejecutar(table: TablaSimbolos, tree: Ast) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        let tipoGeneral;
        
        if(this.expU == false){
            valor_exp1 = this.exp1.ejecutar(table, tree);
            valor_exp2 = this.exp2.ejecutar(table, tree);
            tipoGeneral = this.getTipoMax(this.exp1.tipo, this.exp2.tipo);
        }else{
            valor_expU = this.exp1.ejecutar(table, tree);
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

                    this.tipo = this.exp1.tipo;
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
                    // if (this.exp1.tipo == TIPO.CADENA && this.exp2.tipo == TIPO.CADENA ){
                    this.tipo = TIPO.CADENA;
                    return valor_exp1.toString() + valor_exp2.toString()
                    // }else{
                        // return new Errores("Semantico", "Concatenacion - Error de tipo ", this.fila, this.columna);
                    // }
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
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //      :::::::::::::::::::::    C3D      :::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    translate3d(table: TablaSimbolos, tree: Ast) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;

        if(this.expU==false){
            valor_exp1=this.exp1.translate3d(table, tree);
            valor_exp2=this.exp2.translate3d(table, tree);
        }else{
            valor_expU=this.exp1.translate3d(table, tree);
        }

        switch (this.operador){
            case OperadorAritmetico.MAS:
                console.log("entre a suma");
                return this.suma3D(valor_exp1,valor_exp2,tree);
            case OperadorAritmetico.MENOS:
                return this.resta3D(valor_exp1,valor_exp2,tree);
            case OperadorAritmetico.POR:
                return this.multiplicacion3D(valor_exp1,valor_exp2,tree);
            case OperadorAritmetico.DIV:
                return this.divicion3D(valor_exp1,valor_exp2,tree);
            case OperadorAritmetico.POT:
                return this.potencia(valor_exp1,valor_exp2);
            case OperadorAritmetico.MOD:
                return this.modulo3D(valor_exp1,valor_exp2,tree);
            case OperadorAritmetico.UMENOS:
                return this.unario3D(valor_expU,tree);
            default:
                //Se produjo un error inesperado
                break;
        }
    }

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // :::::::::::::::::::::    Aritmeticas C3D      :::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    suma3D(valor_exp1:Retorno, valor_exp2:Retorno, tree:Ast){
        const generador = tree.generadorC3d;
        const temp = generador.newTemp();
        let tempAux;
        switch(valor_exp1.tipo){
            case TIPO.DECIMAL:
                switch(valor_exp2.tipo){
                    case TIPO.DECIMAL:
                        generador.gen_Exp(temp, valor_exp1.translate3d(), valor_exp2.translate3d(), '+');
                        return new Retorno(temp, true,valor_exp2.tipo);
                    case TIPO.CADENA:
                        let tempAux = generador.newTemp(); generador.freeTemp(tempAux);
                        generador.gen_Exp(tempAux, 'p', 1 + 1, '+');
                        generador.gen_SetStack(tempAux, valor_exp1.translate3d());
                        generador.gen_Exp(tempAux, tempAux, '1', '+');
                        generador.gen_SetStack(tempAux, valor_exp2.translate3d());
                        generador.gen_NextEnv(1);
                        generador.gen_Call('nativa_concat_int_str');
                        generador.gen_GetStack(temp, 'p');
                        generador.gen_AntEnv(1);
                        return new Retorno(temp, true, TIPO.CADENA); 
                    case TIPO.BOOLEANO:

                    default:
                        break;
                }
            break;
            case TIPO.CADENA:
                switch(valor_exp2.tipo){
                    case TIPO.DECIMAL:
                        tempAux = generador.newTemp(); generador.freeTemp(tempAux);
                        generador.gen_Exp(tempAux, 'p', 1 + 1, '+');
                        generador.gen_SetStack(tempAux, valor_exp1.translate3d());
                        generador.gen_Exp(tempAux, tempAux, '1', '+');
                        generador.gen_SetStack(tempAux, valor_exp2.translate3d());
                        generador.gen_NextEnv(1);
                        generador.gen_Call('nativa_concat_str_int');
                        generador.gen_GetStack(temp, 'p');
                        generador.gen_AntEnv(1);
                        return new Retorno(temp, true, TIPO.CADENA); 
                    
                    case TIPO.CADENA:
                        tempAux = generador.newTemp(); generador.freeTemp(tempAux);
                        generador.gen_Exp(tempAux, 'p', 1 + 1, '+');
                        generador.gen_SetStack(tempAux, valor_exp1.translate3d());
                        generador.gen_Exp(tempAux, tempAux, '1', '+');
                        generador.gen_SetStack(tempAux, valor_exp2.translate3d());
                        generador.gen_NextEnv(1);
                        generador.gen_Call('nativa_concat_str_str');
                        generador.gen_GetStack(temp, 'p');
                        generador.gen_AntEnv(1);
                        return new Retorno(temp, true, TIPO.CADENA); 

                    case TIPO.BOOLEANO:

                    default:
                    break;
                }


            default:
                break;
        }
        
    }

    potencia(valor_exp1,valor_exp2){
        if(typeof valor_exp1 == 'number'){
            if(typeof valor_exp2 == 'number'){
                return Math.pow(valor_exp1,valor_exp2);
            }else if (typeof valor_exp2=='boolean'){
                //Error semantico
            }else if( typeof valor_exp2=='string'){
                //Erroro semantico
            }
        }else if (typeof valor_exp1 == 'boolean'){
            //Erro semantico
        }else if( typeof valor_exp1 == 'string'){
            // Error semantico
        }
    }

    resta3D(valor_exp1:Retorno,valor_exp2:Retorno,tree:Ast){
        const generador = tree.generadorC3d;
        const temp = generador.newTemp();
        if(valor_exp1.tipo == TIPO.DECIMAL){
            if(valor_exp2.tipo == TIPO.DECIMAL){
                generador.gen_Exp(temp, valor_exp1.translate3d(), valor_exp2.translate3d(), '-');
                return new Retorno(temp, true, valor_exp2.tipo);
            }
        }
    }

    multiplicacion3D(valor_exp1:Retorno,valor_exp2:Retorno,tree:Ast){
        const generador = tree.generadorC3d;
        const temp = generador.newTemp();
        if(valor_exp1.tipo == TIPO.DECIMAL){
            if(valor_exp2.tipo == TIPO.DECIMAL){
                generador.gen_Exp(temp, valor_exp1.translate3d(), valor_exp2.translate3d(), '*');
                return new Retorno(temp, true, valor_exp2.tipo);
            }
        }
    }

    divicion3D(valor_exp1:Retorno,valor_exp2:Retorno,tree:Ast){
        const generador = tree.generadorC3d;
        const temp = generador.newTemp();
        if(valor_exp1.tipo == TIPO.DECIMAL){
            if(valor_exp2.tipo == TIPO.DECIMAL){
                generador.gen_Exp(temp, valor_exp1.translate3d(), valor_exp2.translate3d(), '/');
                return new Retorno(temp, true, valor_exp2.tipo);
            }
        }
    }

    modulo3D(valor_exp1:Retorno,valor_exp2:Retorno,tree:Ast){
        const generador = tree.generadorC3d;
        const temp = generador.newTemp();
        if(valor_exp1.tipo == TIPO.DECIMAL){
            if(valor_exp2.tipo == TIPO.DECIMAL){
                generador.gen_Code(temp + ' = fmod(' + valor_exp1.translate3d() + ',' + valor_exp2.translate3d() + ');');
                return new Retorno(temp, true, valor_exp2.tipo);
            }
        }
    }

    unario3D(valor_exp1:Retorno,tree:Ast){
        const generador = tree.generadorC3d;
        const temp = generador.newTemp();
        if(valor_exp1.tipo == TIPO.DECIMAL){
            generador.gen_Exp(temp, valor_exp1.translate3d(), '-1', '*');
            return new Retorno(temp, true, valor_exp1.tipo);
        }
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

    
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre = new Nodo("ARITMETICAS","");

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
}