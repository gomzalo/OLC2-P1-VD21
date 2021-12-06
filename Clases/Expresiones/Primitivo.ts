import { Expresion } from "../Interfaz/Expresion";
import { TIPO } from "../TablaSimbolos/Tipo";

export default class Primitivo implements Expresion{
    public tipo : TIPO;
    public valor: any;
    public fila : number;
    public columna : number;

    constructor(valor, tipo, fila, columna ){
        
    }

}