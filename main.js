const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const n = 40;
const minVal = 0;
const maxVal = 100;
const animationDelay = 35; // Increased delay for better visualization

let lst = generateStartingList(n, minVal, maxVal);
let sorting = false;
let ascending = true;
let sortingAlgorithm = bubbleSort;
let sortingAlgorithmGenerator = null;
let animationTimeout = null;

const blockWidth = Math.floor((canvas.width - 60) / lst.length);
const blockHeight = Math.floor((canvas.height - 50) / (maxVal - minVal));
const startX = 30;

document.getElementById('reset').addEventListener('click', reset);

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

document.getElementById('mergeSort').addEventListener('click', () => {
    sortingAlgorithm = mergeSort;
});

document.getElementById('quickSort').addEventListener('click', () => {
    sortingAlgorithm = quickSort;
});

function reset() {
    if (animationTimeout) {
        clearTimeout(animationTimeout);
        animationTimeout = null;
    }
    lst = generateStartingList(n, minVal, maxVal);
    drawList();
    sorting = false;
    sortingAlgorithmGenerator = null;
}

function generateStartingList(n, minVal, maxVal) {
    const list = [];
    for (let i = 0; i < n; i++) {
        list.push(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
    }
    return list;
}

function drawList(colorPositions = {}) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < lst.length; i++) {
        const x = startX + i * blockWidth;
        const y = canvas.height - (lst[i] - minVal) * blockHeight;
        const color = colorPositions[i] || `hsl(${(i * 12) % 360}, 70%, 50%)`;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, blockWidth, (lst[i] - minVal) * blockHeight);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(x, y, blockWidth, (lst[i] - minVal) * blockHeight);
    }
}

function* bubbleSort() {
    for (let i = 0; i < lst.length - 1; i++) {
        for (let j = 0; j < lst.length - 1 - i; j++) {
            if ((lst[j] > lst[j + 1] && ascending) || (lst[j] < lst[j + 1] && !ascending)) {
                [lst[j], lst[j + 1]] = [lst[j + 1], lst[j]];
                drawList({ [j]: 'red', [j + 1]: 'green' });
                yield true;
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
            drawList({ [j]: 'red', [j + 1]: 'green' });
            yield true;
            j--;
        }
        lst[j + 1] = current;
        drawList({ [j + 1]: 'blue' });
        yield true;
    }
}

function* mergeSort(start = 0, end = lst.length - 1) {
    if (start >= end) return;
    
    const mid = Math.floor((start + end) / 2);
    yield* mergeSort(start, mid);
    yield* mergeSort(mid + 1, end);
    
    let i = start;
    let j = mid + 1;
    const temp = [];
    
    while (i <= mid && j <= end) {
        if ((lst[i] <= lst[j] && ascending) || (lst[i] >= lst[j] && !ascending)) {
            temp.push(lst[i++]);
        } else {
            temp.push(lst[j++]);
        }
    }
    
    while (i <= mid) temp.push(lst[i++]);
    while (j <= end) temp.push(lst[j++]);
    
    for (let k = start; k <= end; k++) {
        lst[k] = temp[k - start];
        drawList({ [k]: 'purple' });
        yield true;
    }
}

function* quickSort(start = 0, end = lst.length - 1) {
    if (start >= end) return;
    
    let pivotIndex = start;
    const pivotValue = lst[end];
    
    for (let i = start; i < end; i++) {
        if ((lst[i] < pivotValue && ascending) || (lst[i] > pivotValue && !ascending)) {
            [lst[i], lst[pivotIndex]] = [lst[pivotIndex], lst[i]];
            drawList({ [i]: 'red', [pivotIndex]: 'green' });
            yield true;
            pivotIndex++;
        }
    }
    
    [lst[pivotIndex], lst[end]] = [lst[end], lst[pivotIndex]];
    drawList({ [pivotIndex]: 'blue', [end]: 'orange' });
    yield true;
    
    yield* quickSort(start, pivotIndex - 1);
    yield* quickSort(pivotIndex + 1, end);
}

function runSortingAlgorithm() {
    if (!sorting) return;
    
    const result = sortingAlgorithmGenerator.next();
    
    if (!result.done) {
        animationTimeout = setTimeout(runSortingAlgorithm, animationDelay);
    } else {
        sorting = false;
        drawList();
    }
}

drawList();
