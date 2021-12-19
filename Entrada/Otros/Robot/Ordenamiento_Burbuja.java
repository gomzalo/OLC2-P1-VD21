void imprimir_array(int[] arr){
  for(int i = 0; i < 5; i++){
    println(arr[i]);
  }
}

void bubble_sort(int[] arr){
  int aux;
  for (int i = 0; i < 4; i++){
    for (int j = i + 1; j < 5; j++){
      if (arr[i] > arr[j]){
        aux = arr[i];
        arr[i] = arr[j];
        arr[j] = aux;
      }
    }
  }
}

void main(){
  int[] arr = [2, 1, 3, 0, 4];
  imprimir_array(arr);
  bubble_sort(arr);
  imprimir_array(arr);
  return;
}