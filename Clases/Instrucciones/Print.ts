import { Ast } from "../Ast/Ast";
import { Errores } from "../Ast/Errores";
import { Nodo } from "../Ast/Nodo"
import { Retorno } from "../G3D/Retorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Simbolo } from "../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../TablaSimbolos/Tipo";
import { Struct } from "./Struct/Struct";
import { Return } from "./Transferencia/Return";

export class Print implements Instruccion{

    public parametros : Array<Instruccion | any>;
    public fila : number;
    public columna : number;
    public tipo : boolean;
    public value : string;
    arreglo: boolean;

    constructor(parametros, fila, columna, tipo) {
        this.parametros =parametros;
        this.fila = fila;
        this.columna = columna;
        this.tipo = tipo;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        //TODO: verificar que el tipo del valor sea primitivo
        this.value = "";

        for (let expresion of this.parametros)
        {
            let valor = expresion.ejecutar(table, tree);
            // console.log("print exp val: " + String(valor));
            // console.log(valor);
            if(typeof valor == "undefined"){
                return;
            }
            // if(typeof valor == "string"){
            //     console.log("val es str");
            //     console.log(valor);
            //     // if(valor.includes("\\n")){
            //     // valor.replace(/\n/g,"\\n");
            //     // console.log(valor.replace(/\n/g,"\\n"));
            //     // }
            // }
            // Validaciones de TIPOS A Imprimir
            if (valor instanceof Errores)
            {
                return valor;
            }
            if (valor instanceof Simbolo && valor.tipo == TIPO.STRUCT)
            {
                let temp : Simbolo;
                temp = valor;
                // console.log("print STRUCT");
                // console.log(valor);
                valor = temp.toStringStruct()
            }
            if (expresion.tipo == TIPO.ARREGLO)
            {
                
            }
            
            if (valor instanceof Return)
            {
                let temp: Return;
                temp = valor;
                valor = temp.valor
                // validar si es un struct
            }
            if (TIPO.DECIMAL == expresion.tipo && Number.isInteger(valor))
            {
                // console.log("entreee decimal "+ valor)
                valor.toFixed(2);
            }

            this.value += valor;
            
            
            // return null;    
        }
        
        if (this.tipo){
            // this.value += valor.toString() + "\n";
            (this.value != null ) ? tree.updateConsolaPrintln(String(this.value)) : tree.updateConsolaPrintln("null");
            // tree.updateConsolaPrintln(String(valor))
        }else{
            // this.value += valor.toString();
            (this.value != null ) ? tree.updateConsolaPrint(String(this.value)) : tree.updateConsolaPrint("null");
            // tree.updateConsolaPrint(String(valor))
        }
        return null;
    }

    translate3d(table: TablaSimbolos, tree: Ast) {
        const genc3d = tree.generadorC3d;
        this.parametros.forEach(expresion => {
            let valor3d  = expresion.translate3d(table, tree);
            if(valor3d instanceof Retorno){
                // console.log(valor3d)
                let temp = valor3d.translate3d();
                // let t0 = genc3d.newTemp();
                if(valor3d.tipo == TIPO.CADENA){
                    genc3d.gen_Comment('--------- INICIA PRINT CADENA ---------');
                    genc3d.gen_NextEnv(table.size);
                    genc3d.gen_SetStack('p', temp);
                    genc3d.gen_Call('natPrintStr');
                    genc3d.gen_AntEnv(table.size);
                    // genc3d.gen_Code('');
                    genc3d.gen_Comment('--------- FIN PRINT CADENA ---------');
                }
                if(valor3d.tipo == TIPO.ENTERO){
                    genc3d.gen_Comment('--------- INICIA PRINT INT ---------');
                    genc3d.gen_Print('i', temp);
                    genc3d.gen_Comment('--------- FIN PRINT INT ---------');
                }
                if(valor3d.tipo == TIPO.CHARACTER){
                    genc3d.gen_Comment('--------- INICIA PRINT CHAR ---------');
                    // genc3d.gen_SetStack(t0, temp);
                    // genc3d.gen_Call('natPrintStr');
                    genc3d.gen_NextEnv(table.size);
                    genc3d.gen_SetStack('p', temp);
                    genc3d.gen_Call('natPrintStr');
                    genc3d.gen_AntEnv(table.size);
                }
                if(valor3d.tipo == TIPO.DECIMAL){
                    genc3d.gen_Comment('--------- INICIA PRINT DOUBLE ---------');
                    genc3d.gen_Print('f', temp);
                    genc3d.gen_Comment('--------- FIN PRINT DOUBLE ---------');
                }
                if(valor3d.tipo == TIPO.BOOLEANO)
                {
                    let salida = genc3d.newLabel()
                    genc3d.gen_Comment('--------- INICIA PRINT TRUE ---------');
                    genc3d.gen_Label(valor3d.lblTrue);
                    genc3d.gen_PrintTrue();
                    genc3d.gen_Goto(salida);
                    // genc3d.gen_Label(salida);
                    genc3d.gen_Comment('--------- INICIA PRINT FALSE ---------');
                    genc3d.gen_Label(valor3d.lblFalse);
                    genc3d.gen_PrintFalse();
                    // genc3d.gen_Goto(salida);
                    genc3d.gen_Label(salida);
                }
                
            }
        });
        if(this.tipo){
            genc3d.gen_Print('c', '10');
        }
    }

    recorrer(table: TablaSimbolos, tree: Ast){
        let padre = new Nodo("Print",""); 
        // padre.addChildNode(new Nodo("print",""));
        // padre.addChildNode(new Nodo("(",""));

        let hijo = new Nodo("EXPRESIONES","");
        for (let par of this.parametros)
        {   
            hijo.addChildNode(par.recorrer(table, tree));
        }
        
        padre.addChildNode(hijo);
        // padre.addChildNode(new Nodo(")",""));
        
        return padre;
    }


}