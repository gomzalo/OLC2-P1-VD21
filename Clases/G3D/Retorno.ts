import { Ast } from './../Ast/Ast';
import { TIPO } from './../TablaSimbolos/Tipo';
import { GeneradorC3D } from "./GeneradorC3D";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { Simbolo } from '../TablaSimbolos/Simbolo';

export class Retorno {
    public table : TablaSimbolos;
    public tree : Ast;
    valor: string;
    istemp: boolean;
    tipo: TIPO;
    lblTrue: string;
    lblFalse: string;
    public simbolo : Simbolo;

    constructor(valor:string, istemp:boolean, tipo:TIPO, simbolo: Simbolo | null  = null, table: TablaSimbolos, tree: Ast){
        this.valor = valor;
        this.istemp = istemp;
        this.tipo = tipo;
        this.lblTrue = this.lblFalse = '';
        this.simbolo = simbolo;
        this.table = table;
        this.tree = tree;
    }

    public translate3d() {
        if(this.istemp){
            this.tree.generadorC3d.freeTemp(this.valor);
        }
        return this.valor;
    }
}