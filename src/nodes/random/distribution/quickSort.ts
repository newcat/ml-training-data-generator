type Vector2D = [number, number];

function quickSort(arr: Vector2D[], left: number, right: number) {
    let pivot;
    let partitionIndex;
    if (left < right) {
        pivot = right;
        // Sort elements form left to right on pivot
        partitionIndex = partition(arr, pivot, left, right);
        // Sort left and right
        quickSort(arr, left, partitionIndex - 1);
        quickSort(arr, partitionIndex + 1, right);
    }
    return arr;
}

function partition(arr: Vector2D[], pivot: number, left: number, right: number) {
    const pivotValue = arr[pivot][0];
    let partitionIndex = left;
    for (let i = left; i < right; i++) {
        if (arr[i][0] < pivotValue) {
            swap(arr, i, partitionIndex);
            partitionIndex++;
        }
    }
    swap(arr, right, partitionIndex);
    return partitionIndex;
}

function swap(arr: Vector2D[], a: number, b: number) {
    const temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}

export default quickSort;
