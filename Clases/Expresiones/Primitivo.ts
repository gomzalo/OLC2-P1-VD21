// import { Expresion } from "../Interfaces/Expresion";
import { Ast } from "../Ast/Ast";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../TablaSimbolos/Tipo";
import { Nodo }  from "../Ast/Nodo";
import { Retorno } from "../G3D/Retorno";
export class Primitivo implements Instruccion{
    public tipo : TIPO;
    public valor: any;
    public fila : number;
    public columna : number;
    arreglo: boolean;
    lblTrue: string;
    lblFalse: string;

    constructor(valor, tipo, fila, columna ){
        this.valor =  valor;
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
        this.lblFalse="";
        this.lblTrue="";
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        return this.valor;
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        let valor= this.ejecutar(table, tree);
        const genc3d = tree.generadorC3d;
        switch(this.tipo){
            case TIPO.ENTERO:
                return new Retorno(this.valor, false, TIPO.ENTERO);
            case TIPO.DECIMAL:
                // genc3d.gen_Comment('--------- INICIA RECORRE NUMERO ---------');
                return new Retorno(this.valor, false, TIPO.DECIMAL);
            case TIPO.CADENA:
                const temp = genc3d.newTemp();
                genc3d.genAsignaTemp(temp, 'h');
                genc3d.gen_Comment('--------- INICIA RECORRE CADENA ');
                for (let i = 0; i < valor.length; i++) {
                    genc3d.gen_SetHeap('h', valor.charCodeAt(i));
                    genc3d.nextHeap();
                }
                genc3d.gen_Comment('--------- FIN RECORRE CADENA ');
                genc3d.gen_SetHeap('h', '-1');
                genc3d.nextHeap();
                return new Retorno(temp, true, TIPO.CADENA);
            case TIPO.CHARACTER:
                genc3d.gen_Comment('--------- PRIMITIVO: CHAR');
                const temp2 = genc3d.newTemp();
                genc3d.genAsignaTemp(temp2, 'h');
                genc3d.gen_SetHeap('h', valor.charCodeAt(0));
                genc3d.nextHeap();
                genc3d.gen_SetHeap('h', '-1');
                genc3d.nextHeap();
                return new Retorno(temp2, true, TIPO.CHARACTER);
                // return new Retorno(this.valor, false, TIPO.CHARACTER);
            case TIPO.BOOLEANO:
                // genc3d.gen_Comment('--------- INICIA RECORRE BOOL ---------');
                this.lblTrue = this.lblTrue == '' ? tree.generadorC3d.newLabel() : this.lblTrue;
                this.lblFalse = this.lblFalse == '' ? tree.generadorC3d.newLabel() : this.lblFalse;
                this.valor ? tree.generadorC3d.gen_Goto(this.lblTrue) : tree.generadorC3d.gen_Goto(this.lblFalse);
                let retornar = new Retorno("", false, TIPO.BOOLEANO);
                retornar.lblTrue = this.lblTrue;
                retornar.lblFalse = this.lblFalse;
                return retornar;
            case TIPO.NULO:
                return new Retorno("-1",false,TIPO.NULO);
        }
    }
    recorrer(table: TablaSimbolos, tree: Ast): Nodo {
        let padre = new Nodo("PRIMITIVO","");
        padre.addChildNode(new Nodo(this.valor.toString(),""));
        return padre;
    }
// testing
}