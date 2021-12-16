import { Nodo } from "../../Ast/Nodo";
import { Ast } from "../../Ast/Ast"
// import { Expresion } from "../../Interfaces/Expresion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { OperadorRelacional, TIPO } from "../../TablaSimbolos/Tipo";
import { Errores } from '../../Ast/Errores';
import { Instruccion } from "../../Interfaces/Instruccion";
import { Retorno } from "../../G3D/Retorno";
export class Relacional implements Instruccion{
    public exp1: any;
    public operador: any;
    public exp2: any;
    public expU: any;
    public fila: number;
    public columna: number;
    public tipo : TIPO;
    arreglo: boolean;

    //C3D
    public lblTrue: string;
    public lblFalse: string;

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
         switch(this.operador){
            case OperadorRelacional.IGUALIGUAL:
                return this.igualigual(valor_exp1,valor_exp2);
            case OperadorRelacional.DIFERENTE:
                return this.diferente(valor_exp1,valor_exp2);
            case OperadorRelacional.MENORQUE:
                return this.menorque(valor_exp1,valor_exp2);
            case OperadorRelacional.MENORIGUAL:
                return this.menorigual(valor_exp1,valor_exp2);
            case OperadorRelacional.MAYORQUE:
                return this.mayorque(valor_exp1,valor_exp2);
            case OperadorRelacional.MAYORIGUAL:
                return this.mayoigual(valor_exp1,valor_exp2);
            default:
                break;
        }
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

    igualigual(valor_exp1,valor_exp2){
        if(typeof valor_exp1 == 'number'){
            if(typeof valor_exp2 == 'number'){
                return valor_exp1==valor_exp2;
            }else if (typeof valor_exp2 =='boolean'){
                //Error Semantico
            }else if(typeof valor_exp2 == 'string'){
                //char
                if(valor_exp2.length==1){
                    let num=valor_exp2.charCodeAt(0);
                    return valor_exp1==num;
                }else{
                    //String 
                    //Error semantico
                }
            }
        }else if(typeof valor_exp1 == 'boolean'){
            if(typeof valor_exp2== 'number'){
                //Error semantico
            }else if (typeof valor_exp2=='boolean'){
                return valor_exp1 ==valor_exp2;
            }else if (typeof valor_exp2 == 'string'){
                //Error semantico
            }
        }else if (typeof valor_exp1 == 'string'){
            if(valor_exp1.length==1){
                //char
                if(typeof valor_exp2=='number'){
                    let num=valor_exp1.charCodeAt(0);
                    return num==valor_exp2;
                }else if( typeof valor_exp2 == 'boolean'){
                    //Error semantico
                }else if( typeof valor_exp2 == 'string'){
                    return valor_exp1 ==valor_exp2 ;
                }
            }else{
                //cadena
                if(typeof valor_exp2=='number'){
                    //error semantico
                }else if( typeof valor_exp2 == 'boolean'){
                    //Error semantico
                }else if( typeof valor_exp2 == 'string'){
                    return valor_exp1 ==valor_exp2 ;
                }
            }
        }
    }

    diferente(valor_exp1,valor_exp2){
        if(typeof valor_exp1 == 'number'){
            if(typeof valor_exp2 == 'number'){
                return valor_exp1!=valor_exp2;
            }else if (typeof valor_exp2 =='boolean'){
                //Error Semantico
            }else if(typeof valor_exp2 == 'string'){
                //char
                if(valor_exp2.length==1){
                    let num=valor_exp2.charCodeAt(0);
                    return valor_exp1!=num;
                }else{
                    //String 
                    //Error semantico
                }
            }
        }else if(typeof valor_exp1 == 'boolean'){
            if(typeof valor_exp2== 'number'){
                //Error semantico
            }else if (typeof valor_exp2=='boolean'){
                return valor_exp1 != valor_exp2;
            }else if (typeof valor_exp2 == 'string'){
                //Error semantico
            }
        }else if (typeof valor_exp1 == 'string'){
            if(valor_exp1.length==1){
                //char
                if(typeof valor_exp2=='number'){
                    let num=valor_exp1.charCodeAt(0);
                    return num!=valor_exp2;
                }else if( typeof valor_exp2 == 'boolean'){
                    //Error semantico
                }else if( typeof valor_exp2 == 'string'){
                    return valor_exp1 !=valor_exp2 ;
                }
            }else{
                //cadena
                if(typeof valor_exp2=='number'){
                    //error semantico
                }else if( typeof valor_exp2 == 'boolean'){
                    //Error semantico
                }else if( typeof valor_exp2 == 'string'){
                    return valor_exp1 !=valor_exp2 ;
                }
            }
        }
    }


    menorque(valor_exp1,valor_exp2){
        if(typeof valor_exp1 == 'number'){
            if( typeof valor_exp2 == 'number'){
                return valor_exp1 < valor_exp2;
            }else if ( typeof valor_exp2 == 'boolean'){
                //Error semantico
            }else if (typeof valor_exp2 == 'string'){
                if(valor_exp2.length == 1){
                    let num=valor_exp2.charCodeAt(0);
                    return valor_exp1 <  num;
                }else{
                    // Error semantico 
                }
            }
        }else if (typeof valor_exp1 == 'boolean'){
            //Error semantico
        }else if (typeof valor_exp1 =='string'){
            if(valor_exp1.length==1){
                if(typeof valor_exp2 =='number'){
                    let num=valor_exp1.charCodeAt(0);
                    return num < valor_exp2;
                }else if (typeof valor_exp2 == 'boolean'){
                    //Error semantico
                }else if ( typeof  valor_exp2 == 'string'){
                    if(valor_exp2.length==1){
                        let num1=valor_exp1.charCodeAt(0);
                        let num2=valor_exp2.charCodeAt(0);
                        return num1< num2;
                    }else{
                        //Error semantico
                    }
                }
            }else{
                //cadena
                //error semantico
            }
        }
    }

    menorigual(valor_exp1,valor_exp2){
        if(typeof valor_exp1 == 'number'){
            if( typeof valor_exp2 == 'number'){
                return valor_exp1 <= valor_exp2;
            }else if ( typeof valor_exp2 == 'boolean'){
                //Error semantico
            }else if (typeof valor_exp2 == 'string'){
                if(valor_exp2.length == 1){
                    let num=valor_exp2.charCodeAt(0);
                    return valor_exp1 <=  num;
                }else{
                    // Error semantico 
                }
            }
        }else if (typeof valor_exp1 == 'boolean'){
            //Error semantico
        }else if (typeof valor_exp1 =='string'){
            if(valor_exp1.length==1){
                if(typeof valor_exp2 =='number'){
                    let num=valor_exp1.charCodeAt(0);
                    return num <= valor_exp2;
                }else if (typeof valor_exp2 == 'boolean'){
                    //Error semantico
                }else if ( typeof  valor_exp2 == 'string'){
                    if(valor_exp2.length==1){
                        let num1=valor_exp1.charCodeAt(0);
                        let num2=valor_exp2.charCodeAt(0);
                        return num1<= num2;
                    }else{
                        //Error semantico
                    }
                }
            }else{
                //cadena
                //error semantico
            }
        }
    }

    mayorque(valor_exp1,valor_exp2){
        if(typeof valor_exp1 == 'number'){
            if( typeof valor_exp2 == 'number'){
                return valor_exp1 > valor_exp2;
            }else if ( typeof valor_exp2 == 'boolean'){
                //Error semantico
            }else if (typeof valor_exp2 == 'string'){
                if(valor_exp2.length == 1){
                    let num=valor_exp2.charCodeAt(0);
                    return valor_exp1 >  num;
                }else{
                    // Error semantico 
                }
            }
        }else if (typeof valor_exp1 == 'boolean'){
            //Error semantico
        }else if (typeof valor_exp1 =='string'){
            if(valor_exp1.length==1){
                if(typeof valor_exp2 =='number'){
                    let num=valor_exp1.charCodeAt(0);
                    return num > valor_exp2;
                }else if (typeof valor_exp2 == 'boolean'){
                    //Error semantico
                }else if ( typeof  valor_exp2 == 'string'){
                    if(valor_exp2.length==1){
                        let num1=valor_exp1.charCodeAt(0);
                        let num2=valor_exp2.charCodeAt(0);
                        return num1 > num2;
                    }else{
                        //Error semantico
                    }
                }
            }else{
                //cadena
                //error semantico
            }
        }
    }

    mayoigual(valor_exp1,valor_exp2){
        if(typeof valor_exp1 == 'number'){
            if( typeof valor_exp2 == 'number'){
                return valor_exp1 >= valor_exp2;
            }else if ( typeof valor_exp2 == 'boolean'){
                //Error semantico
            }else if (typeof valor_exp2 == 'string'){
                if(valor_exp2.length == 1){
                    let num=valor_exp2.charCodeAt(0);
                    return valor_exp1 >=  num;
                }else{
                    // Error semantico 
                }
            }
        }else if (typeof valor_exp1 == 'boolean'){
            //Error semantico
        }else if (typeof valor_exp1 =='string'){
            if(valor_exp1.length==1){
                if(typeof valor_exp2 =='number'){
                    let num=valor_exp1.charCodeAt(0);
                    return num >= valor_exp2;
                }else if (typeof valor_exp2 == 'boolean'){
                    //Error semantico
                }else if ( typeof  valor_exp2 == 'string'){
                    if(valor_exp2.length==1){
                        let num1=valor_exp1.charCodeAt(0);
                        let num2=valor_exp2.charCodeAt(0);
                        return num1 >= num2;
                    }else{
                        //Error semantico
                    }
                }
            }else{
                //cadena
                //error semantico
            }
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

    recorrer(table: TablaSimbolos, tree: Ast){
        let padre = new Nodo("EXP RELACIONAL","");

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

    translate3d(table: TablaSimbolos, tree: Ast) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;

        if(this.expU==false){
            valor_exp1=this.exp1.translate3d(table,tree);
            valor_exp2=this.exp2.translate3d(table,tree);
        }else{
            valor_expU=this.exp1.translate3d(table,tree);
        }

        switch(this.operador){
            case OperadorRelacional.IGUALIGUAL:
                return this.igualigual3D(valor_exp1,valor_exp2,tree);
            case OperadorRelacional.DIFERENTE:
                return this.diferente3D(valor_exp1,valor_exp2,tree);
            case OperadorRelacional.MENORQUE:
                return this.menorque3D(valor_exp1,valor_exp2,tree);
            case OperadorRelacional.MENORIGUAL:
                return this.menorigual3D(valor_exp1,valor_exp2,tree);
            case OperadorRelacional.MAYORQUE:
                return this.mayorque3D(valor_exp1,valor_exp2,tree);
            case OperadorRelacional.MAYORIGUAL:
                return this.mayoigual3D(valor_exp1,valor_exp2,tree);
            default:
                break;
        }
    }

    igualigual3D(valor_exp1:Retorno, valor_exp2:Retorno, tree:Ast){
        const genC3d  = tree.generadorC3d;
        const temp = genC3d.newTemp();
        if( valor_exp1.tipo == TIPO.DECIMAL ){
            if( valor_exp2.tipo == TIPO.DECIMAL ){
                return this.compararExp(valor_exp1,valor_exp2,tree,'==');
            }
        }else{
            if(valor_exp1.tipo == TIPO.CADENA){
                if(valor_exp2.tipo == TIPO.CADENA){
                    const tempAux = genC3d.newTemp();
                    genC3d.gen_Exp(tempAux, 'p', 1 + 1, '+');
                    genC3d.gen_SetStack(tempAux, valor_exp1.translate3d());
                    genC3d.gen_Exp(tempAux, tempAux, '1', '+');
                    genC3d.gen_SetStack(tempAux, valor_exp2.translate3d());
                    genC3d.gen_NextEnv(1);
                    genC3d.gen_Call('nativa_compararIgual_str_str');
                    genC3d.gen_GetStack(temp, 'p');
                    genC3d.gen_AntEnv(1);

                    this.lblTrue = this.lblTrue == '' ? genC3d.newLabel().toString() : this.lblTrue;
                    console.log(this.lblTrue)
                    this.lblFalse = this.lblFalse == '' ? genC3d.newLabel().toString() : this.lblFalse;
                    console.log(this.lblFalse)
                    genC3d.gen_If(temp, '1', '==', this.lblTrue);
                    genC3d.gen_Goto(this.lblFalse);
                    const retorno = new Retorno(temp, true, TIPO.BOOLEANO);
                    retorno.lblTrue = this.lblTrue;
                    retorno.lblFalse = this.lblFalse;
                    return retorno;
                }
            }
        }
    }

    menorque3D(valor_exp1:Retorno,valor_exp2:Retorno,tree:Ast){
        if(valor_exp1.tipo==TIPO.DECIMAL){
            if(valor_exp2.tipo==TIPO.DECIMAL){
                return this.compararExp(valor_exp1,valor_exp2,tree,'<');
            }
        }
    }

    menorigual3D(valor_exp1:Retorno,valor_exp2:Retorno,tree:Ast){
        if(valor_exp1.tipo==TIPO.DECIMAL){
            if(valor_exp2.tipo==TIPO.DECIMAL){
                return this.compararExp(valor_exp1,valor_exp2,tree,'<=');
            }
        }
    }
    mayorque3D(valor_exp1:Retorno,valor_exp2:Retorno,tree:Ast){
        if(valor_exp1.tipo==TIPO.DECIMAL){
            if(valor_exp2.tipo==TIPO.DECIMAL){
                return this.compararExp(valor_exp1,valor_exp2,tree,'>');
            }
        }
    }

    mayoigual3D(valor_exp1:Retorno,valor_exp2:Retorno,tree:Ast){
        if(valor_exp1.tipo==TIPO.DECIMAL){
            if(valor_exp2.tipo==TIPO.DECIMAL){
                return this.compararExp(valor_exp1,valor_exp2,tree,'>=');
            }
        }
    }

    diferente3D(valor_exp1:Retorno,valor_exp2:Retorno,tree:Ast){
        const genC3d  = tree.generadorC3d;
        const temp = genC3d.newTemp();
        if(valor_exp1.tipo==TIPO.DECIMAL){
            if(valor_exp2.tipo==TIPO.DECIMAL){
                return this.compararExp(valor_exp1,valor_exp2,tree,'!=');
            }
        }else{
            if(valor_exp1.tipo == TIPO.CADENA){
                if(valor_exp2.tipo == TIPO.CADENA){
                    const tempAux = genC3d.newTemp();
                    genC3d.gen_Exp(tempAux, 'p', 1 + 1, '+');
                    genC3d.gen_SetStack(tempAux, valor_exp1.translate3d());
                    genC3d.gen_Exp(tempAux, tempAux, '1', '+');
                    genC3d.gen_SetStack(tempAux, valor_exp2.translate3d());
                    genC3d.gen_NextEnv(1);
                    genC3d.gen_Call('nativa_compararIgual_str_str');
                    genC3d.gen_GetStack(temp, 'p');
                    genC3d.gen_AntEnv(1);

                    this.lblTrue = this.lblTrue == '' ? genC3d.newLabel() : this.lblTrue;
                    this.lblFalse = this.lblFalse == '' ? genC3d.newLabel() : this.lblFalse;
                    genC3d.gen_If(temp, '1', '!=', this.lblTrue);
                    genC3d.gen_Goto(this.lblFalse);
                    const ret = new Retorno(temp, true, TIPO.BOOLEANO);
                    ret.lblTrue = this.lblTrue;
                    ret.lblFalse = this.lblFalse;
                    return ret;
                }
            }
        }
    }


    compararExp(valor_exp1: Retorno, valor_exp2: Retorno,tree:Ast,signo:string): Retorno {
        const genC3d = tree.generadorC3d;
        this.lblTrue = this.lblTrue == '' ? genC3d.newLabel() : this.lblTrue;
        this.lblFalse = this.lblFalse == '' ? genC3d.newLabel() : this.lblFalse;
        genC3d.gen_If(valor_exp1.translate3d(), valor_exp2.translate3d(),signo, this.lblTrue);
        genC3d.gen_Goto(this.lblFalse);
        const ret = new Retorno('', false, TIPO.BOOLEANO);
        ret.lblTrue = this.lblTrue;
        ret.lblFalse = this.lblFalse;
        return ret;
    }

    limpiar() {
        this.lblFalse='';
        this.lblTrue='';
        if(this.expU==false){
         this.exp1.limpiar();
         this.exp2.limpiar();
        }else{
         this.exp1.limpiar();
        }
        
     }
    

}