struct Actor
{
    string nombre;
    int edad;
    double deciaml;
    char c;
    boolean bandera;
};

void main()
{
    Actor actor = Actor("nombre",9, 23.04, 'c',true);
    println(actor);
    println(actor.edad);

}