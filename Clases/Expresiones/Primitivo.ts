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
        const generator = tree.generadorC3d;
        if(typeof valor== 'number'){
            return new Retorno(this.valor, false, TIPO.DECIMAL);
        }else if (typeof valor=='string'){
            const temp = generator.newTemp();
            generator.genAsignaTemp(temp, 'h');
            for (let i = 0; i < valor.length; i++) {
                generator.gen_SetHeap('h', valor.charCodeAt(i));
                generator.nextHeap();
            }
            generator.gen_SetHeap('h', '-1');
            generator.nextHeap();
        return new Retorno(temp, true, TIPO.CADENA);
        }else if (typeof valor== 'boolean'){
            return TIPO.BOOLEANO;
        }
    }
    recorrer(table: TablaSimbolos, tree: Ast): Nodo {
        let padre = new Nodo("PRIMITIVO","");
        padre.addChildNode(new Nodo(this.valor.toString(),""));
        return padre;
    }

}