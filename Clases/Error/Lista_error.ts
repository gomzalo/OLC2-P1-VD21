class Lista_Error extends Array<Nodo_Error>{
    
    private static instancia:Lista_Error = new Lista_Error();

    private constructor(){
        super();
    }

    public static getInstancia():Lista_Error{
        return this.instancia;
    }
    
}