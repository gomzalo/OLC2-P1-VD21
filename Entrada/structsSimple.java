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
    string name;
    int clases;
    double promedio;
    char c;
    boolean estado;
    Estudiante next;
};

void main()
{
    println(" -------------Instanciando Actor----------");
    // Actor actor = Actor("nombre",9, 23.04, 'c',true);
    // println(actor);
    // println(actor.edad);
    // println(actor.deciaml);
    // println(actor.c);
    // println(actor.bandera);
    // println(actor.bandera.error); // error semantico
    println(" -------------Instanciando ACTOR 2----------");
    // Actor actor2 = Actor("nombre",9, 23.04, 'c',true);
    // println(actor2);
    // println(actor2.edad);
    // println(actor2.deciaml);
    // println(actor2.c);
    // println(actor2.bandera);

    
    // println("--------ESTUDIAAAANTEE------");
    // Estudiante nodoEstudiante = Estudiante("nombre",9, 23.04, 'c',true,null);

    println("--------ESTUDIAAAANTEE 1------");
    Estudiante nodoEstudiante = Estudiante("noob",9, 23.04, 'c',true,null);
    println(nodoEstudiante);
    println(nodoEstudiante.name);
    println(nodoEstudiante.clases);
    println(nodoEstudiante.c);
    println(nodoEstudiante.estado);
    println(nodoEstudiante.next);

    println("--------ESTUDIAAAANTEE 2------");
    Estudiante PapaEstudiante = Estudiante("tata",9, 23.04, 'c',true,nodoEstudiante);
    println(PapaEstudiante);
    println(PapaEstudiante.name);
    println(PapaEstudiante.clases);
    println(PapaEstudiante.c);
    println(PapaEstudiante.estado);
    println(PapaEstudiante.next);

    println("--------ESTUDIAAAANTEE 3------");
    Estudiante abuelo = Estudiante("Gonzalo",9, 23.04, 'c',true,PapaEstudiante);
    println(abuelo);
    println(abuelo.name);
    println(abuelo.clases);
    println(abuelo.c);
    println(abuelo.estado);
    println(abuelo.next);
  println("--------ACCESSOOO Y EDICION  3------");
  	abuelo.next.name = "Acceso desde abuelo";
  println(abuelo.next);
  println(PapaEstudiante.next);

}