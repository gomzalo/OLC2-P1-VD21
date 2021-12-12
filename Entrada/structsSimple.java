struct Actor
{
    string nombre;
    int edad;
    double deciaml;
    char c;
    boolean bandera;
    // Actor actor;
};

struct Estudiante
{
    string nombre;
    int edad;
    double deciaml;
    char c;
    boolean bandera;
    Estudiante next;
};

void main()
{
    Actor actor = Actor("nombre",9, 23.04, 'c',true);
    println(actor);
    println(actor.edad);
    println(actor.deciaml);
    println(actor.c);
    println(actor.bandera);
    println(actor.bandera.error); // error semantico
    Actor actor2 = Actor("nombre",9, 23.04, 'c',true);
    println(actor2);
    println(actor2.edad);
    println(actor2.deciaml);
    println(actor2.c);
    println(actor2.bandera);

}