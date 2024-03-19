<script setup lang="ts">
// const variant = {
//   matrix_1: [
//     [1, 4, 5, 3],
//     [0.25, 1, 3, 2],
//     [0.2, 0.3333333333333333, 1, 1],
//     [0.3333333333333333, 0.5, 1, 1],
//   ],
//   matrix_2: [
//     [1, 0.5, 2],
//     [2, 1, 3],
//     [0.5, 0.3333333333333333, 1],
//   ],
//   matrix_3: [
//     [1, 0.5, 0.25],
//     [2, 1, 0.3333333333333333],
//     [4, 3, 1],
//   ],
//   matrix_4: [
//     [1, 8, 3],
//     [0.125, 1, 2],
//     [0.3333333333333333, 0.5, 1],
//   ],
//   matrix_5: [
//     [1, 0.25, 0.3333333333333333],
//     [4, 1, 2],
//     [3, 0.5, 1],
//   ],
// };

// const mathExpectationsOfConsistencyIndex: Record<number, number> = {
//   1: 0,
//   2: 0,
//   3: 0.58,
//   4: 0.9,
//   5: 1.12,
//   6: 1.24,
//   7: 1.32,
//   8: 1.41,
//   9: 1.45,
//   10: 1.49,
// };

const roundTwoDigits = (value: number) => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
  // return value;
};

// let variantMatrix = variant.matrix_4;

// const calculatePriorityElement = (arr: number[]) =>
//   roundTwoDigits(
//     Math.pow(
//       arr.reduce((acc, value) => acc * value, 1),
//       1 / arr.length,
//     ),
//   );

// const calculatePriorityVector = (matrix: number[][]) => matrix.map((arr) => calculatePriorityElement(arr));

// const calculateWeightElement = (vectorElement: number, vectorSum: number) => roundTwoDigits(vectorElement / vectorSum);

// const calculateWeightVector = (vector: number[], priorityVectorSum: number) =>
//   vector.map((element) => calculateWeightElement(element, priorityVectorSum));

// const calculateMatrixWeightElement = (matrixRow: number[], weightVector: number[]) =>
//   roundTwoDigits(matrixRow.reduce((acc, value, index) => acc + value * weightVector[index]!, 0));

// const calculateMatrixWeightVector = (matrix: number[][], weightVector: number[]) =>
//   matrix.map((matrixRow) => calculateMatrixWeightElement(matrixRow, weightVector));

// const calculateLambdaVector = (weightVector: number[], matrixWeightVector: number[]) =>
//   matrixWeightVector.map((value, index) => roundTwoDigits(value / weightVector[index]!));

// const calculateEigenvalue = (lambdaVector: number[]) => Math.max(...lambdaVector);

// const calculateConsistencyIndex = (eigenvalue: number, lambdaVector: number[]) =>
//   roundTwoDigits((eigenvalue - lambdaVector.length) / (lambdaVector.length - 1));

// const calculateConsistencyRatio = (matrix: number[][], consistencyIndex: number) =>
//   roundTwoDigits(consistencyIndex / mathExpectationsOfConsistencyIndex[matrix.length]!);

// const isConsistencyAcceptable = (consistencyRatio: number) => Math.abs(consistencyRatio) < 0.1;

// const calculateWeightsRatioMatrix = (weightVector: number[]) => {
//   const matrix: number[][] = [];
//   weightVector.forEach((weight) => {
//     matrix.push(weightVector.map((value) => roundTwoDigits(weight / value)));
//   });

//   return matrix;
// };

// const calculateCorrectedWeightRatioMatrix = (matrix: number[][], weightsRatioMatrix: number[][]) => {
//   const newMatrix = matrix.map((arr, index) =>
//     arr.map((value, index2) => Math.abs(roundTwoDigits(value - weightsRatioMatrix[index]![index2]!))),
//   );
//   return newMatrix;
// };

// const findMaxSumIndex = (weightRatioMatrix: number[][]) => {
//   const sums = weightRatioMatrix.map((arr) => arr.reduce((acc, value) => acc + value, 0));
//   return sums.indexOf(Math.max(...sums));
// };

// const calculateNewCorrectedMatrix = (matrix: number[][], weightRatioMatrix: number[][], indexToChange: number) =>
//   matrix.map((arr, index) => {
//     if (index === indexToChange) return weightRatioMatrix[index]!;
//     return arr.map((value, index2) =>
//       index2 === indexToChange ? roundTwoDigits(1 / weightRatioMatrix[indexToChange]![index]!) : value,
//     );
//   });

// const solveMatrix = (matrix: number[][]) => {
//   let priorityVector = calculatePriorityVector(matrix);
//   let priorityVectorSum = priorityVector.reduce((acc, value) => acc + value, 0);
//   let weightVector = calculateWeightVector(priorityVector, priorityVectorSum);
//   let matrixWeightVector = calculateMatrixWeightVector(variantMatrix, weightVector);
//   let lambdaVector = calculateLambdaVector(weightVector, matrixWeightVector);
//   let eigenvalue = calculateEigenvalue(lambdaVector);
//   let consistencyIndex = calculateConsistencyIndex(eigenvalue, lambdaVector);
//   let consistencyRatio = calculateConsistencyRatio(variantMatrix, consistencyIndex);

//   if (!isConsistencyAcceptable(consistencyRatio)) {
//     const weightsRatioMatrix = calculateWeightsRatioMatrix(weightVector);
//     const weightsCorrectedRatioMatrix = calculateCorrectedWeightRatioMatrix(variantMatrix, weightsRatioMatrix);
//     const maxSumIndex = findMaxSumIndex(weightsCorrectedRatioMatrix);

//     const newVariant = calculateNewCorrectedMatrix(variantMatrix, weightsRatioMatrix, maxSumIndex);

//     solveMatrix(newVariant);
//     return;
//   }
// };

// solveMatrix(variantMatrix);

const solveMatrix = (matrixOld: number[][], indexRow: number, indexColumn: number) => {
  const matrixNew = matrixOld.map((row, index1) =>
    row.map((value, index2) => {
      if (index1 === indexRow && index2 === indexColumn) return roundTwoDigits(1 / value);
      if (index1 === indexRow) return roundTwoDigits(value / matrixOld[indexRow]![indexColumn]!);
      if (index2 === indexColumn) return roundTwoDigits(-value / matrixOld[indexRow]![indexColumn]!);

      return roundTwoDigits(
        (value * matrixOld[indexRow]![indexColumn]! -
          matrixOld[index1]![indexColumn]! * matrixOld[indexRow]![index2]!) /
          matrixOld[indexRow]![indexColumn]!,
      );
    }),
  );

  return matrixNew;
};

const m = [
  [-4.55, -6.73, -10.18],
  [0.68, 1.16, 2.84],
  [2.09, 5.01, 5.14],
  [-12.86, -27.94, -34.37],
];

console.log(solveMatrix(m, 2, 0));
</script>

<template>
  <div class="fields"></div>
</template>

<style scoped lang="scss">
.fields {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
  flex-direction: column;
  width: 100%;

  .field {
    width: 100%;

    &-title {
      font-size: 16px;
    }
  }

  .button {
    height: 100%;
  }
}

.dates {
  display: flex;
  justify-content: space-around;
  width: 100%;
  gap: 20px;
}

.dates > div {
  width: 100%;
}

@media (max-width: 768px) {
  .dates {
    display: flex;
    flex-direction: column;
  }
}
</style>
