const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const n = 50;
const minVal = 0;
const maxVal = 100;

let lst = generateStartingList(n, minVal, maxVal);
let sorting = false;
let ascending = true;
let sortingAlgorithm = bubbleSort;
let sortingAlgorithmGenerator = null;

const blockWidth = Math.floor((canvas.width - 100) / lst.length);
const blockHeight = Math.floor((canvas.height - 150) / (maxVal - minVal));
const startX = 50;

document.getElementById('reset').addEventListener('click', () => {
    lst = generateStartingList(n, minVal, maxVal);
    drawList();
    sorting = false;
});

document.getElementById('start').addEventListener('click', () => {
    if (!sorting) {
        sorting = true;
        sortingAlgorithmGenerator = sortingAlgorithm();
        runSortingAlgorithm();
    }
});

document.getElementById('ascending').addEventListener('click', () => {
    ascending = true;
});

document.getElementById('descending').addEventListener('click', () => {
    ascending = false;
});

document.getElementById('bubbleSort').addEventListener('click', () => {
    sortingAlgorithm = bubbleSort;
});

document.getElementById('insertionSort').addEventListener('click', () => {
    sortingAlgorithm = insertionSort;
});

function generateStartingList(n, minVal, maxVal) {
    const list = [];
    for (let i = 0; i < n; i++) {
        list.push(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
    }
    return list;
}

function drawList(colorPositions = {}) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < lst.length; i++) {
        const x = startX + i * blockWidth;
        const y = canvas.height - (lst[i] - minVal) * blockHeight;
        const color = colorPositions[i] || `rgb(${128 + (i % 3) * 32}, ${128 + (i % 3) * 32}, ${128 + (i % 3) * 32})`;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, blockWidth, canvas.height);
    }
}

function* bubbleSort() {
    for (let i = 0; i < lst.length - 1; i++) {
        for (let j = 0; j < lst.length - 1 - i; j++) {
            const num1 = lst[j];
            const num2 = lst[j + 1];
            if ((num1 > num2 && ascending) || (num1 < num2 && !ascending)) {
                [lst[j], lst[j + 1]] = [lst[j + 1], lst[j]];
                drawList({[j]: 'green', [j + 1]: 'red'});
                yield;
            }
        }
    }
}

function* insertionSort() {
    for (let i = 1; i < lst.length; i++) {
        let current = lst[i];
        let j = i - 1;
        while (j >= 0 && ((lst[j] > current && ascending) || (lst[j] < current && !ascending))) {
            lst[j + 1] = lst[j];
            j--;
            lst[j + 1] = current;
            drawList({[j]: 'green', [j + 1]: 'red'});
            yield;
        }
    }
}

function runSortingAlgorithm() {
    if (sorting) {
        const result = sortingAlgorithmGenerator.next();
        if (!result.done) {
            requestAnimationFrame(runSortingAlgorithm);
        } else {
            sorting = false;
        }
    }
}

drawList(); // Initial drawing

