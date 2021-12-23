package Otros.Arreglos;
void quicksort(int[] arr, int low, int high){
    println("");
    println("Entra a quicksort");
    println("");
    println("arr: ", arr, ", low: ", low, ", high: ", high);
    if(low < high){
        int p = partition(arr, low, high);
        quicksort(arr, low, p-1);
        quicksort(arr, p+1, high);
    }
}


void swap(int[] arr, int low, int pivot){
    println("");
    println("Entra a swap");
    println("");
    println("arr: ", arr, ", low: ", low, ", pivot: ", pivot);
    println("arr[low]: ", arr[low]);
    println("arr[pivot]: ", arr[pivot]);
    int tmp = arr[low];
    arr[low] = arr[pivot];
    arr[pivot] = tmp;
}

int partition(int[] arr, int low, int high){
    println("");
    println("Entra a partition");
    println("");
    int p = low, j;
    println("arr: ", arr, ", low: ", low, ", high: ", high);
    for(j=low+1; j <= high; j++)
        if(arr[j] < arr[low])
            p++;
            swap(arr, p, j);

    swap(arr, low, p);
    return p;
}

void main() {
    int[] arr = [4, 8, 1, 10, 13, 5, 2, 7];
    // Sorting the whole array
    println(arr.length());
    quicksort(arr, 0, arr.length() - 1);
    println(arr);
    return;
}
