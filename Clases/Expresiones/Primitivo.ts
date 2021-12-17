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

    constructor(valor, tipo, fila, columna ){
        this.valor =  valor;
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        return this.valor;
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        let valor= this.ejecutar(table, tree);
        const genc3d = tree.generadorC3d;
        if(typeof valor== 'number'){
            // genc3d.gen_Comment('--------- INICIA RECORRE NUMERO ---------');
            return new Retorno(this.valor, false, TIPO.DECIMAL);
        }else if (typeof valor=='string'){
            const temp = genc3d.newTemp();
            genc3d.genAsignaTemp(temp, 'h');
            genc3d.gen_Comment('--------- INICIA RECORRE CADENA ---------');
            for (let i = 0; i < valor.length; i++) {
                genc3d.gen_SetHeap('h', valor.charCodeAt(i));
                genc3d.nextHeap();
            }
            genc3d.gen_Comment('--------- FIN RECORRE CADENA ---------');
            genc3d.gen_SetHeap('h', '-1');
            genc3d.nextHeap();
        return new Retorno(temp, true, TIPO.CADENA);
        }else if (typeof valor== 'boolean'){
            // genc3d.gen_Comment('--------- INICIA RECORRE BOOL ---------');
            return TIPO.BOOLEANO;
        }
    }
    recorrer(table: TablaSimbolos, tree: Ast): Nodo {
        let padre = new Nodo("PRIMITIVO","");
        padre.addChildNode(new Nodo(this.valor.toString(),""));
        return padre;
    }
// testing
}