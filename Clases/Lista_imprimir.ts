class Lista_Imprimir extends Array<string>{
    
    private static instance:Lista_Imprimir = new Lista_Imprimir();

    private constructor(){
        super();
    }

    public static getInstance():Lista_Imprimir{
        return this.instance;
    }

}