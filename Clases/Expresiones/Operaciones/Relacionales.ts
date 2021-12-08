import {Nodo} from "../../Ast/Nodo";
import {Ast} from "../../Ast/Ast"
// import { Expresion } from "../../Interfaces/Expresion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { OperadorRelacional, TIPO } from "../../TablaSimbolos/Tipo";
import {Errores} from '../../Ast/Errores';
import { Instruccion } from "../../Interfaces/Instruccion";
export class Relacional implements Instruccion{
    public exp1: any;
    public operador: any;
    public exp2: any;
    public expU: any;
    public fila: number;
    public columna: number;
    public tipo : TIPO;

    public constructor(exp1, operador, exp2, fila, columna, expU ) {
        this.exp1 = exp1;
        this.operador = operador;
        this.exp2 = exp2;
        this.fila = fila;
        this.columna = columna;
        this.expU = expU;
        this.tipo = TIPO.BOOLEANO;
    }
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
         * de las operaciones relacionales permitidas que soporta el lenguaje descrito en el enunciado.
         */
        switch (this.operador) {
            case OperadorRelacional.MENORQUE:
                if(typeof valor_exp1 === 'number'){
                    if(typeof valor_exp2 === 'number'){
                        return valor_exp1 < valor_exp2;
                    }else if(typeof valor_exp2 == 'string'){
                        if(valor_exp2.length == 1){
                            let num_ascii = valor_exp2.charCodeAt(0);
                            return valor_exp1 < num_ascii;
                        }else{
                            // TODO: agregar error
                            return new Errores("Semantico", "Relacional -MENORQUE- Error de tipos no coinciden " , this.fila, this.columna);
                        }
                    }//TODO: agregar los otros casos de errores
                }else if(typeof valor_exp1 === 'string'){
                    let num_ascii = valor_exp1.charCodeAt(0);

                    if(typeof valor_exp2 === 'number'){
                        return num_ascii < valor_exp2;
                    }else if(typeof valor_exp2 == 'string'){
                        if(valor_exp2.length == 1){
                            let num_ascii2 = valor_exp2.charCodeAt(0);
                            return num_ascii < num_ascii2;
                        }else{
                            // TODO: agregar error
                            return new Errores("Semantico", "Relacional -MENORQUE- Error de tipos no coinciden " , this.fila, this.columna);
                        }
                    }//TODO: agregar los otros casos de errores
                }
                
                break;
            case OperadorRelacional.MAYORQUE:
                    if(typeof valor_exp1 === 'number'){
                        if(typeof valor_exp2 === 'number'){
                            return valor_exp1 > valor_exp2;
                        }else if(typeof valor_exp2 == 'string'){
                            if(valor_exp2.length == 1){
                                let num_ascii = valor_exp2.charCodeAt(0);
                                return valor_exp1 > num_ascii;
                            }else{
                                // TODO: agregar error
                                return new Errores("Semantico", "Relacional -MAYORQUE- Error de tipos no coinciden " , this.fila, this.columna);
                            }
                        }
                    }else if(typeof valor_exp1 === 'string'){
                        let num_ascii = valor_exp1.charCodeAt(0);
    
                        if(typeof valor_exp2 === 'number'){
                            return num_ascii > valor_exp2;
                        }else if(typeof valor_exp2 == 'string'){
                            if(valor_exp2.length == 1){
                                let num_ascii2 = valor_exp2.charCodeAt(0);
                                return num_ascii > num_ascii2;
                            }else{
                                // TODO: agregar error
                                return new Errores("Semantico", "Relacional -MAYORQUE- Error de tipos no coinciden " , this.fila, this.columna);
                            }
                        }//TODO: agregar los otros casos de errores
                    }else {
                        //error semantico
                        
                    }
                    
                    break;
            case OperadorRelacional.IGUALIGUAL:
                if(typeof valor_exp1 === 'number'){
                    if(typeof valor_exp2 === 'number'){
                        return valor_exp1 == valor_exp2;
                    }
                }
                break;
            case OperadorRelacional.MAYORIGUAL:
                    if(typeof valor_exp1 === 'number'){
                        if(typeof valor_exp2 === 'number'){
                            return valor_exp1 >= valor_exp2;
                        }
                    }
                    break;
            // TODO: Agregar mas casos de relacionales (IGUALIGUAL, DIFERENCIA, MAYORIGUAL, MENORIGUAL)
            case OperadorRelacional.MENORIGUAL:
                    if(typeof valor_exp1 === 'number'){
                        if(typeof valor_exp2 === 'number'){
                            return valor_exp1 <= valor_exp2;
                        }
                    }
                    break;
            default:
                break;
        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

    getTipo(table: TablaSimbolos, tree: Ast): TIPO {
        let valor = this.ejecutar(table, tree);

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
        let padre = new Nodo("Exp. Relacional","");

        if(this.expU){
            padre.addChildNode(new Nodo(this.operador,""));
            padre.addChildNode(this.exp1.recorrer());
        }else{
            padre.addChildNode(this.exp1.recorrer());
            padre.addChildNode(new Nodo(this.operador,""));
            padre.addChildNode(this.exp2.recorrer());
        }
        return padre;
    }
}