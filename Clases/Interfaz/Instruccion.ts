
export interface Instruccion {


    /**
     * @function ejecutar execute instruccions
     * @param ast llevamos el control de todo el programa
     * @param ts accede a la tabla de simbolos
     */
    ejecutar();

    translate3d();

    recorrer();


}