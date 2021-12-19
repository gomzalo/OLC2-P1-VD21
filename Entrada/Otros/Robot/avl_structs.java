int index = 0;
struct Nodo {
  int valor,
  int altura,
  Nodo izquierda,
  Nodo derecha,
  int indice
};
Nodo root = null;
int height(Nodo N){
  if (N == null)
    return 0;
  return N.altura;
}

int max(int a, int b){
  if (a > b)
    return a;
  return b;
}

Nodo rightRotate(Nodo y) {
  Nodo x = y.izquierda;
  Nodo T2 = x.derecha;
  x.derecha = y;
  y.izquierda = T2;
  y.altura = max( height(y.izquierda), height(y.derecha) ) + 1;
  x.altura = max( height(x.izquierda), height(x.derecha) ) + 1;
  return x;
}

Nodo leftRotate(Nodo x) {
  Nodo y = x.derecha;
  Nodo T2 = y.izquierda;
  y.izquierda = x;
  x.derecha = T2;
  x.altura = max( height(x.izquierda), height(x.derecha) ) + 1;
  y.altura = max( height(y.izquierda), height(y.derecha) ) + 1;
  return y;
}

int getBalance(Nodo N){ 
  if (N == null)
    return 0;
  return height(N.izquierda) - height(N.derecha);
}

Nodo insert(Nodo node, int key){ 
  if (node == null){
    return Nodo(key, 1, null, null, 0);
  }
  if (key < node.valor){
    node.izquierda = insert(node.izquierda, key);
  }else if (key > node.valor){
    node.derecha = insert(node.derecha, key);
  }else{
    return node;
  }
  node.altura = 1 + max( height(node.izquierda), height(node.derecha) );
  int balance = getBalance(node);
  Nodo izq = node.izquierda;
  if (izq!=null){
    if (balance > 1 && key < izq.valor)
      return rightRotate(node);
    if (balance > 1 && key > izq.valor) {
      node.izquierda = leftRotate(node.izquierda);
      return rightRotate(node);
    }
  }
  Nodo der = node.derecha;
  if (der!=null){
    if (balance < -1 && key > der.valor){
      return leftRotate(node);
    }
    if (balance < -1 && key < der.valor){ 
      node.derecha = rightRotate(node.derecha);
      return leftRotate(node);
    }
  }

  return node;
}

void preOrder(Nodo node){
  if (node != null) {
    print(node.valor);
    print(" ");
    preOrder(node.izquierda);
    preOrder(node.derecha);
  }
}

void indexnodes(Nodo node){
  if(node == null){ 
    return;
  }
  node.indice = index;
  index = index + 1;
  if(node.izquierda != null){
    indexnodes(node.izquierda);
  }
  if(node.derecha != null){
    indexnodes(node.derecha);
  }
}

String graphviz(Nodo node){
  index = 0;
  indexnodes(node);
  println("digraph g{");
  graphnode(node);
  println("}");
  return ("");
}

String graphnode(Nodo node){
  if(node == null) {
    print(""); 
    return "";
  }
  print("node");
  print(node.indice);
  print("[label='");
  print(node.valor);
  println("'];");
  if(node.izquierda != null){
    graphnode(node.izquierda);
    Nodo izq = node.izquierda;
    print("node");
    print(node.indice);
    print(" -> ");
    print("node");
    print(izq.indice);
    println(";");
  }
  if(node.derecha != null){
    graphnode(node.derecha);
    Nodo der = node.derecha;
    print("node");
    print(node.indice);
    print(" -> ");
    print("node");
    print(der.indice);
    println(";");
  }
  return "";
}

void main(){
  println("--------------------------ARBOL AVL----------------");
  root = insert(root, 10);
  root = insert(root, 20);
  println("");
  root = insert(root, 30);
  root = insert(root, 40);
  root = insert(root, 50);
  root = insert(root, 25);
  root = insert(root, 35);
  root = insert(root, 90);
  root = insert(root, 85);
  println("Preorder traversal of constructed tree is : ");
  preOrder(root);
  println("Graphviz");
  graphviz(root);
}