class Lista_Imprimir extends Array {
    constructor() {
        super();
    }
    static getInstance() {
        return this.instance;
    }
}
Lista_Imprimir.instance = new Lista_Imprimir();
