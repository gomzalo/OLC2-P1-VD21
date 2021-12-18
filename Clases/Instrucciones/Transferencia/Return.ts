import { Nodo } from "../../Ast/Nodo";
import { Ast } from "../../Ast/Ast";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import { Errores } from "../../Ast/Errores";
import { Retorno } from "../../G3D/Retorno";

export class Return implements Instruccion{
    public expresion : Instruccion | any;
    public valor : any;
    public tipo : TIPO;
    public fila: number;
    public columna: number;
    public arreglo: boolean;

    constructor(expresion,fila,columna){
        this.expresion = expresion;
        this.fila = fila;
        this.columna =columna;
    }
    

    
    ejecutar(table: TablaSimbolos, tree: Ast) {
        if(this.expresion != null){
            let valor =  this.expresion.ejecutar(table, tree);
            if(valor instanceof Errores)
            {
                return valor;
            }
            this.tipo = this.expresion.tipo;
            this.valor = valor;
            return this;
        }else{
            return null;
        }
        // this.tipo = this.valor.tipo;
    }
    
    translate3d(table: TablaSimbolos, tree: Ast) {
        const genc3d = tree.generadorC3d;
        const valor = this.expresion?.translate3d(table, tree) || new Retorno('-1', false, TIPO.VOID);
        let result_func = table.actual_funcion;
        if(valor == null){
            return new Errores('Semantico','No se permite el uso de return en la instrucción.', this.fila, this.columna);
        }
        if(result_func.tipo == TIPO.BOOLEANO){
            const templabel = genc3d.newLabel();
            genc3d.gen_Label(valor.lblTrue);
            genc3d.gen_SetStack('p', '1');
            genc3d.gen_Goto(templabel);
            genc3d.gen_Label(valor.lblFalse);
            genc3d.gen_SetStack('p', '0');
            genc3d.gen_Label(templabel);
        }else if (result_func.tipo !== TIPO.VOID){
            genc3d.gen_SetStack('p', valor.getValor());
        }

        genc3d.gen_Goto(table.return || '');
    }

    recorrer(): Nodo {
        let padre = new Nodo("RETURN","");
        padre.addChildNode(new Nodo("return",""));
        if(this.valor != null){
            padre.addChildNode(this.expresion.recorrer());
        }
        return padre;
    }

}