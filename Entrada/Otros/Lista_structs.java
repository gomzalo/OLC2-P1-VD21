println("---------------------STRUCTS--------------------------------");
struct Node{
    int value,
    Node next
};

struct List{
    List first
};

void insertFirst(List list, int value){
    Node aux = list.first;
    Node newNode = Node(value, aux);
    list.first = newNode;
}

void insertLast(List list, int value){
    Node aux = list.first;
    while (aux.next != null){
        aux = aux.next;
    }
    Node newNode = Node(value, null);
    aux.next = newNode;
}

void printList(List list){
    Node aux = list.first;
    while(aux != null){
        if (aux.next == null)
            println(aux.value);
        else
            print(aux.value);
        aux = aux.next;
    }
}




void main()
{
    List lista = List(null);
    insertFirst(lista, 5);
    insertFirst(lista, 4);
    insertFirst(lista, 3);
    insertFirst(lista, 2);

    insertLast(lista, 10);
    insertLast(lista, 20);
    insertLast(lista, 30);
    insertLast(lista, 40);

    println("---IMPRIMIR LISTA---");
    printList(lista);
    println("---FIN IMPRIMIR---");
}