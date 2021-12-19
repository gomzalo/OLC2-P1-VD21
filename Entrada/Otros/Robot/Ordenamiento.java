int getPivot(int value){
  	int res = value % 1 == 0 ? value : value - 0.5;
    return res;
}
void swap(int i, int j, int [] array){
    int temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}
void quickSort(int low, int high, int[] array){
    int i = low;
    int j = high;
    int pivot = array[getPivot( (low + high) / 2)];
    while(i <= j){
        while(array[i] < pivot){
            i++;
        }
        while(array[j] > pivot){
            j--;
        }
        if(i <= j){
            swap(i, j, array);
            i++;
            j--;
        }
    }
    if(low < j){
        quickSort(low, j, array);
    }
    if(i < high){
        quickSort(i, high, array);
    }
}
int[] array = [8, 48, 69, 12, 25, 98, 71, 33, 129, 5];
void main(){
    quickSort(0, array.length() - 1, array);
    println("QuickSort: "& array);
}