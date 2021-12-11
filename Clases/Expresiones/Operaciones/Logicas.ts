import { Nodo } from "../../Ast/Nodo";
import { Ast } from "../../Ast/Ast"
// import { Expresion } from "../../Interfaces/Expresion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { OperadorLogico, TIPO } from "../../TablaSimbolos/Tipo";
import { Errores } from '../../Ast/Errores';
import { Instruccion } from "../../Interfaces/Instruccion";

export class Logica implements Instruccion{
    fila: number;
    columna: number;
    public exp1: any;
    public operador: any;
    public exp2: any;
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
         * de las operaciones Logicas permitidas que soporta el lenguaje descrito en el enunciado.
         */
        switch (this.operador) {
            case OperadorLogico.AND:
                if(typeof valor_exp1 == 'boolean'){
                    if(typeof valor_exp2 == 'boolean'){
                        this.tipo = TIPO.BOOLEANO;
                        return valor_exp1 && valor_exp2;
                    }else{
                        // ERROR SEMANTICO
                        return new Errores("Semantico", "Logica -AND- Los tipos no coinciden " , this.fila, this.columna);
                    }
                }
                break;

            case OperadorLogico.OR:
                if(typeof valor_exp1 == 'boolean'){
                    if(typeof valor_exp2 == 'boolean'){
                        this.tipo = TIPO.BOOLEANO;
                        return valor_exp1 || valor_exp2;
                    }else {
                        // ERROR SEMANTICO
                        return new Errores("Semantico", "Logica -OR- Los tipos no coinciden " , this.fila, this.columna);
                    }
                }
                break;
            case OperadorLogico.NOT:
                    if(typeof valor_expU == 'boolean'){
                        this.tipo = TIPO.BOOLEANO;
                        return !valor_expU;
                    }else{
                        //TODO: Error
                        return new Errores("Semantico", "Logica -NOT- El tipo no coincide " , this.fila, this.columna);
                    }
            // TODO: Agregar caso para logica OR. 
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
        let padre = new Nodo("Exp. Logica","");

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