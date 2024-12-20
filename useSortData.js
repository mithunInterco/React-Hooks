import { useCallback } from "react";

const useSortData = (sortField, sortName, compareField) => {
  const mergeSort = useCallback((array) => {
    if (array.length <= 1) return array;

    const middle = Math.floor(array.length / 2);
    const left = mergeSort(array.slice(0, middle));
    const right = mergeSort(array.slice(middle));

    return merge(left, right);
  }, []);

  const merge = useCallback(
    (left, right) => {
      const sortedArray = [];
      let leftIndex = 0;
      let rightIndex = 0;

      while (leftIndex < left.length && rightIndex < right.length) {
        const a = left[leftIndex];
        const b = right[rightIndex];

        // Custom sorting logic based on compareField and sortField
        if (a[sortName] === compareField && b[sortName] !== compareField) {
          sortedArray.push(a);
          leftIndex++;
        } else if (
          a[sortName] !== compareField &&
          b[sortName] === compareField
        ) {
          sortedArray.push(b);
          rightIndex++;
        } else if (a[sortField] < b[sortField]) {
          sortedArray.push(a);
          leftIndex++;
        } else if (a[sortField] > b[sortField]) {
          sortedArray.push(b);
          rightIndex++;
        } else {
          // Stable sorting based on array position if values are equal
          sortedArray.push(leftIndex < rightIndex ? a : b);
          leftIndex < rightIndex ? leftIndex++ : rightIndex++;
        }
      }
      return [
        ...sortedArray,
        ...left.slice(leftIndex),
        ...right.slice(rightIndex),
      ];
    },
    [sortField, sortName, compareField]
  );

  const sortData = useCallback((data) => mergeSort(data), [mergeSort]);

  return sortData;
};

export default useSortData;
