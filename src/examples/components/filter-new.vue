import _default from '../../../dist/vite.config';
<script setup lang="ts">
const variant = {
  matrix_1: [
    [1, 4, 5, 3],
    [0.25, 1, 3, 2],
    [0.2, 0.3333333333333333, 1, 1],
    [0.3333333333333333, 0.5, 1, 1],
  ],
  matrix_2: [
    [1, 0.5, 2],
    [2, 1, 3],
    [0.5, 0.3333333333333333, 1],
  ],
  matrix_3: [
    [1, 0.5, 0.25],
    [2, 1, 0.3333333333333333],
    [4, 3, 1],
  ],
  matrix_4: [
    [1, 8, 3],
    [0.125, 1, 2],
    [0.3333333333333333, 0.5, 1],
  ],
  matrix_5: [
    [1, 0.25, 0.3333333333333333],
    [4, 1, 2],
    [3, 0.5, 1],
  ],
};

const roundTwoDigits = (value: number) => {
  return +value.toFixed(2);
};

const firstMatrix = variant.matrix_1;

const calculatePriorityElement = (arr: number[]) =>
  roundTwoDigits(
    Math.pow(
      arr.reduce((acc, value) => acc * value, 1),
      1 / arr.length,
    ),
  );

const calculatePriorityVector = (matrix: number[][]) => matrix.map((arr) => calculatePriorityElement(arr));

const priorityVector = calculatePriorityVector(firstMatrix);

const priorityVectorSum = priorityVector.reduce((acc, value) => acc + value, 0);

const calculateWeightElement = (vectorElement: number, vectorSum: number) => roundTwoDigits(vectorElement / vectorSum);

const calculateWeightVector = (vector: number[]) =>
  vector.map((element) => calculateWeightElement(element, priorityVectorSum));

const weightVector = calculateWeightVector(priorityVector);

const calculateMatrixWeightElement = (matrixRow: number[], weightVector: number[]) =>
  roundTwoDigits(matrixRow.reduce((acc, value, index) => acc + value * weightVector[index]!, 0));

const calculateMatrixWeightVector = (matrix: number[][]) =>
  matrix.map((matrixRow) => calculateMatrixWeightElement(matrixRow, weightVector));

const matrixWeightVector = calculateMatrixWeightVector(firstMatrix);

const calculateLambdaVector = (weightVector: number[], matrixWeightVector: number[]) =>
  matrixWeightVector.map((value, index) => roundTwoDigits(value / weightVector[index]!));

const lambdaVector = calculateLambdaVector(weightVector, matrixWeightVector);

const calculateEigenvalue = (lambdaVector: number[]) => Math.max(...lambdaVector);

const eigenvalue = calculateEigenvalue(lambdaVector);

const calculateConsistencyIndex = (eigenvalue: number, lambdaVector: number[]) =>
  roundTwoDigits((eigenvalue - lambdaVector.length) / (lambdaVector.length - 1));

const consistencyIndex = calculateConsistencyIndex(eigenvalue, lambdaVector);

console.log(priorityVector, weightVector, matrixWeightVector, lambdaVector, eigenvalue, consistencyIndex);
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
