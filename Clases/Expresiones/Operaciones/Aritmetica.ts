import { OperadorAritmetico } from '../../TablaSimbolos/Tipo';
import Nodo from "../../Ast/Nodo";
import Ast from "../../Ast/Ast"
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";


export default class Aritmetica implements Expresion {
    public exp1: any;
    public operador: any;
    public exp2: any;
    public fila: number;
    public columna: number;
    public expU: any;

    public constructor(exp1, operador, exp2, fila, columna, expU ) {
        this.exp1 = exp1;
        this.operador = operador;
        this.exp2 = exp2;
        this.fila = fila;
        this.columna = columna;
        this.expU = expU;
    }

    getTipo(ts: TablaSimbolos, ast: Ast) : TIPO{
        let valor = this.getValorImplicito(ts, ast);

        if(typeof valor === 'number'){   
            return TIPO.DECIMAL;
        }else if(typeof valor === 'string'){
            return TIPO.CADENA;
        }else if(typeof valor === 'boolean'){
            return TIPO.BOOLEANO;
        }
    }

    getValorImplicito(table: TablaSimbolos, tree: Ast) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        
        
        if(this.expU == false){
            valor_exp1 = this.exp1.getValorImplicito(tree, table);
            valor_exp2 = this.exp2.getValorImplicito(tree, table);
        }else{
            valor_expU = this.exp1.getValorImplicito(tree, table);
        }

        /**
         * Para las siguientes validaciones nos basamos en la tabla de 
         * de las operaciones aritmeticas permitidas que soporta el lenguaje descrito en el enunciado.
         */
        switch (this.operador) {
            case OperadorAritmetico.MAS:
                if(typeof valor_exp1 === 'number'){
                    if(typeof valor_exp2 === 'number'){
                        return valor_exp1 + valor_exp2;
                    }else if(typeof valor_exp2 === 'boolean'){
                        let num = 1;
                        if(valor_exp2 == false){
                            num = 0;
                        }
                        return valor_exp1 + num;
                    }else if(typeof valor_exp2 === 'string'){
                        if(valor_exp2.length == 1){ //si es de tamaño 1 es un caracter
                            let numascii = valor_exp2.charCodeAt(0);
                            return valor_exp1 + numascii;
                        }else{
                            return valor_exp1 + valor_exp2; //se convierte a cadena
                        }
                    }
                }else if(typeof valor_exp1 === 'boolean'){
                    if(typeof valor_exp2 === 'number'){
                        let num = 1;
                        if(valor_exp1 == false){
                            num = 0;
                        }
                        return num + valor_exp2;
                    }else if(typeof valor_exp2 === 'boolean'){
                        //TODO: agregar error semantico.
                    }
                }else if(typeof valor_exp1 == 'string'){
                    if(valor_exp1.length == 1){
                        if(typeof valor_exp2 == 'string'){
                            if(valor_exp2.length == 1){ //si es de tamaño 1 es un caracter
                                console.log('suma de caracteres ')
                                return valor_exp1 + valor_exp2;
                            }else{
                                return valor_exp1 + valor_exp2; //se convierte a cadena
                            }
                        }
                    }else{
                        if(typeof valor_exp2 == 'string'){
                            if(valor_exp2.length == 1){ //si es de tamaño 1 es un caracter
                                return valor_exp1 + valor_exp2; 
                            }else{
                                return valor_exp1 + valor_exp2; //se convierte a cadena
                            }
                        }
                    }
                    
                }
                
                break;

            case OperadorAritmetico.UMENOS:
                if(typeof valor_expU == 'number'){
                    return -valor_expU;
                }else{
                     //TODO: agregar error semantico.
                }
                break;
            case OperadorAritmetico.MENOS:
                if(typeof valor_exp1 === 'number'){
                    if(typeof valor_exp2 === 'number'){
                        return valor_exp1 - valor_exp2;
                    }//TODO: Agregar las otras validaciones
                }
                break;
            case OperadorAritmetico.POR:
                    if(typeof valor_exp1 === 'number'){
                        if(typeof valor_exp2 === 'number'){
                            return valor_exp1 * valor_exp2;
                        }//TODO: Agregar las otras validaciones
                    }
                    break;  
            case OperadorAritmetico.DIV:
                if(typeof valor_exp1 === 'number'){
                    if(typeof valor_exp2 === 'number'){
                        return valor_exp1 / valor_exp2;
                    }//TODO: Agregar las otras validaciones
                }
                break;
            case OperadorAritmetico.MOD:
                if(typeof valor_exp1 === 'number'){
                    if(typeof valor_exp2 === 'number'){
                        return valor_exp1 % valor_exp2;
                    }
                }
                break;
            case OperadorAritmetico.POT:
                if(typeof valor_exp1 === 'number'){
                    if(typeof valor_exp2 === 'number'){
                        return Math.pow(valor_exp1, valor_exp2);
                    }
                }
                break;
            //TODO: Agregar otros casos de aritmeticas (POTENCIA, MODULO)
            default:
                //TODO: agregar errror que ser produjo algo inesperado.
                break;
        }

    }
    
    recorrer(): Nodo {
        let padre = new Nodo("Exp. Aritmetica","");

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