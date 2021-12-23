export class Nodo{
    public token : string ;
    public lexema : string;
    public hijos : Array<Nodo>;

    constructor(token : string, lexema : string) {
        this.token = token;
        this.lexema = lexema;
        this.hijos = new Array<Nodo>();
    }
    /**
     * @method setChilds agregar listado de hijos
     * @param hijos 
     */
    public setChilds(hijos : Array<Nodo>){
        this.hijos = hijos
    }

    /**
     * @function getChilds retorna array de childs 
     * @returns retorna array de nodos
     */
    public getChilds():Array<Nodo>{
        return this.hijos;
    }

    /**
     * @method addChildNode agregar Hijo
     * @param nuevo Nodo
     */
    public addChildNode(nuevo :Nodo):void{
        this.hijos.push(nuevo);
    }

    /**
     * @function getValor retorna el nombre del token 
     * @returns retorna el token
     */
    public getValor():string{
        return this.lexema;
    }

    /**
     * @function setValor retorna el nombre del token 
     * @returns retorna el token
     */
    public setValor(valor : string){
        this.lexema = valor;
    }

    /**
     * @function getToken retorna el nombre del token 
     * @returns retorna el token
     */
    public getToken():string{
        return this.token;
    }

    /**
     * @function GraficarSintactico Hace la estructura de la grafica 
     * @returns retorna la cadena total de la grafica 
     */
    public GraficarSintactico():string{
        let grafica: string = `digraph {\n\n${this.GraficarNodos(this, "0")} \n\n}`
        return grafica;
    }

    /**
     * @function GraficarNodos
     * @param nodo nodo posicion actual
     * @param i id nodo a graficar
     * @returns retorna string de nodos
     */
    public GraficarNodos(nodo: Nodo, i: string):string{
        let k = 0;
        let r = "";
        let nodoTerm : string = nodo.token;
        nodoTerm = nodoTerm.replace("\"","");
        r = `node${i}[label = \"${nodoTerm}\"];\n`;

        for(let j = 0; j<= nodo.hijos.length - 1; j++){
            r = `${r}node${i} -> node${i}${k}\n`;
            r = r + this.GraficarNodos(nodo.hijos[j], ""+i+k);
            k = k + 1;
        }

        if(!(nodo.lexema.match(''))||!(nodo.lexema.match(""))){
            let nodoToken = nodo.lexema;
            nodoToken = nodoToken.replace("\"","");
            r = r + `node${i}c[label = \"${nodoToken}\"];\n`;
            r = r + `node${i} -> node${i}c\n`;
        }
        return r;
    }
}