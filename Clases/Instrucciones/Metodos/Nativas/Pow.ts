import { Ast } from "../../../Ast/Ast";
import { Errores } from "../../../Ast/Errores";
import { Nodo } from "../../../Ast/Nodo";
import { Instruccion } from "../../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../../TablaSimbolos/Tipo";
import { Funcion } from "../Funcion";

export class Pow implements Funcion{
    public fila: number;
    public columna: number;
    public tipo: TIPO;
    public id: string;
    public parameters: any[];
    public instructions: Instruccion[];
    arreglo: boolean;
    public expBase;
    public expElevacion;
    /**
     * @function Pow Elevar un numero_base a un numero_potencia
     * @param expBase Base a elevar
     * @param expElevacion Potencia
     * @param fila 
     * @param columna 
     */
    constructor(expBase,expElevacion,fila, columna){
        this.expBase =expBase;
        this.expElevacion =expElevacion;
        this.fila =fila;
        this.columna =columna;
    }
    public tipoStruct: any;

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let resBase = this.expBase.ejecutar(table,tree);
        if(resBase instanceof Errores)
        {
            return resBase;
        }   
        let resElevacion = this.expElevacion.ejecutar(table,tree);
        if(resElevacion instanceof Errores)
        {
            return resElevacion;
        }   

        if (this.expBase.tipo == TIPO.ENTERO && this.expElevacion.tipo == TIPO.ENTERO)
        {
            this.tipo = TIPO.ENTERO;
            return Math.pow(resBase,resElevacion);
            
        }

        
    }
    translate3d(table: TablaSimbolos, tree: Ast): void {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast): Nodo {
        let padre =  new Nodo("POW","");

        let base =  new Nodo("Expresion Base","");
        base.addChildNode(this.expBase.recorrer(table,tree));
        let elev =  new Nodo("Expresion Elevacion","");
        elev.addChildNode(this.expBase.recorrer(table,tree));

        padre.addChildNode(base);
        padre.addChildNode(elev);

        return padre;
    }
}