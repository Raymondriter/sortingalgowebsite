// Sorting Algorithm Visualizer - Main JavaScript

class SortingVisualizer {
    constructor() {
        this.array = [];
        this.originalArray = [];
        this.arraySize = 50;
        this.animationSpeed = 50;
        this.isPlaying = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.steps = [];
        this.currentAlgorithm = null;
        this.startTime = 0;
        this.endTime = 0;
        this.comparisons = 0;
        this.swaps = 0;
        this.soundEnabled = true;
        this.audioContext = null;
        this.soundVolume = 0.3;
        this.enableComparisonSound = true;
        this.enableSwapSound = true;

        // Educational features
        this.learningProgress = {
            algorithmsMastered: 0,
            quizScores: [],
            studyStreak: 0,
            totalStudyTime: 0,
            categoryProgress: {
                simple: 0,
                efficient: 0,
                hybrid: 0,
                distribution: 0,
                educational: 0
            },
            achievements: []
        };

        this.quizData = {
            currentQuestion: 0,
            score: 0,
            timeLeft: 30,
            questions: []
        };

        this.codePlayground = {
            currentAlgorithm: 'bubble',
            userCode: '',
            testResults: []
        };

        this.canvas = document.getElementById('visualizer-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.codeContainer = document.getElementById('code-display');

        this.init();
        this.setupAdvancedFeatures();
    }

    init() {
        this.setupEventListeners();
        this.generateNewArray();
        this.resizeCanvas();
        this.drawArray();
    }

    setupAdvancedFeatures() {
        // Performance metrics elements
        this.metricsContainer = document.getElementById('performance-metrics');
        this.timerDisplay = document.getElementById('timer-display');
        this.comparisonsCount = document.getElementById('comparisons-count');
        this.swapsCount = document.getElementById('swaps-count');
        this.arraySizeDisplay = document.getElementById('array-size-display');

        // Sound controls elements
        this.soundContainer = document.getElementById('sound-controls');
        this.soundToggle = document.getElementById('sound-toggle');
        this.comparisonSoundToggle = document.getElementById('comparison-sound');
        this.swapSoundToggle = document.getElementById('swap-sound');
        this.volumeSlider = document.getElementById('volume-slider');

        // Validation elements
        this.validationContainer = document.getElementById('validation-panel');
        this.validationStatus = document.getElementById('validation-status');
        this.validationText = document.getElementById('validation-text');
        this.originalArrayDisplay = document.getElementById('original-array');
        this.sortedArrayDisplay = document.getElementById('sorted-array');
        this.expectedArrayDisplay = document.getElementById('expected-array');

        // Setup event listeners for advanced features
        this.setupMetricsControls();
        this.setupSoundControls();
        this.setupValidationControls();

        // Initialize audio context
        this.initAudioContext();
    }

    setupMetricsControls() {
        const startBenchmark = document.getElementById('start-benchmark');
        const resetMetrics = document.getElementById('reset-metrics');
        const compareAlgorithms = document.getElementById('compare-algorithms');

        startBenchmark?.addEventListener('click', () => this.startBenchmark());
        resetMetrics?.addEventListener('click', () => this.resetMetrics());
        compareAlgorithms?.addEventListener('click', () => this.compareAllAlgorithms());
    }

    setupSoundControls() {
        this.soundToggle?.addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
        });

        this.comparisonSoundToggle?.addEventListener('change', (e) => {
            this.enableComparisonSound = e.target.checked;
        });

        this.swapSoundToggle?.addEventListener('change', (e) => {
            this.enableSwapSound = e.target.checked;
        });

        this.volumeSlider?.addEventListener('input', (e) => {
            this.soundVolume = e.target.value / 100;
        });
    }

    setupValidationControls() {
        // Validation runs automatically after sorting
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    playSound(frequency, duration = 100, type = 'sine') {
        if (!this.soundEnabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(this.soundVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }

    startBenchmark() {
        if (!this.currentAlgorithm) {
            alert('Please select an algorithm first!');
            return;
        }

        this.startTime = performance.now();
        this.comparisons = 0;
        this.swaps = 0;

        // Run algorithm multiple times for accurate measurement
        this.runBenchmark();
    }

    async runBenchmark(iterations = 5) {
        const times = [];

        for (let i = 0; i < iterations; i++) {
            // Generate fresh array for each iteration
            this.generateNewArray();
            const testArray = [...this.array];

            const start = performance.now();

            // Run the algorithm synchronously for benchmarking
            const sortedArray = await this.runAlgorithmSynchronously(testArray);

            const end = performance.now();
            times.push(end - start);

            // Verify correctness
            const expected = [...testArray].sort((a, b) => a - b);
            if (JSON.stringify(sortedArray) !== JSON.stringify(expected)) {
                console.error('Algorithm produced incorrect result!');
                break;
            }
        }

        this.endTime = performance.now();
        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;

        this.updateMetricsDisplay(avgTime, times);
    }

    async runAlgorithmSynchronously(arr) {
        // Simplified synchronous version for benchmarking
        const n = arr.length;

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                this.comparisons++;
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    this.swaps++;
                }
            }
        }

        return arr;
    }

    updateMetricsDisplay(avgTime, times) {
        if (this.timerDisplay) {
            this.timerDisplay.textContent = `${avgTime.toFixed(2)}ms`;
        }

        if (this.comparisonsCount) {
            this.comparisonsCount.textContent = this.comparisons.toString();
        }

        if (this.swapsCount) {
            this.swapsCount.textContent = this.swaps.toString();
        }

        if (this.arraySizeDisplay) {
            this.arraySizeDisplay.textContent = this.arraySize.toString();
        }

        console.log(`Benchmark Results: ${avgTime.toFixed(2)}ms average over ${times.length} runs`);
    }

    resetMetrics() {
        this.startTime = 0;
        this.endTime = 0;
        this.comparisons = 0;
        this.swaps = 0;

        if (this.timerDisplay) this.timerDisplay.textContent = '0.00ms';
        if (this.comparisonsCount) this.comparisonsCount.textContent = '0';
        if (this.swapsCount) this.swapsCount.textContent = '0';
    }

    async compareAllAlgorithms() {
        // Get selected algorithms from checkboxes
        const checkboxes = document.querySelectorAll('#algorithm-checkboxes input[type="checkbox"]:checked');
        if (checkboxes.length === 0) {
            alert('Please select at least one algorithm to compare!');
            return;
        }

        const selectedAlgorithms = Array.from(checkboxes).map(cb => cb.value);
        const results = [];

        // Show loading state
        const resultsContainer = document.getElementById('comparison-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="comparison-loading">
                    <div class="loading-spinner"></div>
                    <p>Running performance comparison...</p>
                </div>
            `;
            resultsContainer.style.display = 'block';
        }

        // Test each algorithm
        for (const algorithmName of selectedAlgorithms) {
            const algorithmFunction = this[algorithmName];
            if (!algorithmFunction) continue;

            console.log(`Testing ${algorithmName}...`);

            // Store current algorithm
            const originalAlgorithm = this.currentAlgorithm;
            this.currentAlgorithm = algorithmFunction.bind(this);

            // Run benchmark
            const benchmarkResults = await this.runMultiAlgorithmBenchmark(algorithmName);

            results.push({
                name: this.getAlgorithmDisplayName(algorithmName),
                ...benchmarkResults
            });

            // Restore original algorithm
            this.currentAlgorithm = originalAlgorithm;
        }

        // Display results
        this.displayComparisonResults(results);
    }

    async runMultiAlgorithmBenchmark(algorithmName) {
        const iterations = 3; // Fewer iterations for comparison
        const times = [];
        let totalComparisons = 0;
        let totalSwaps = 0;

        for (let i = 0; i < iterations; i++) {
            // Generate fresh array for each iteration
            this.generateNewArray();
            const testArray = [...this.array];

            // Reset counters
            this.comparisons = 0;
            this.swaps = 0;

            const start = performance.now();

            // Run the algorithm synchronously for benchmarking
            const sortedArray = await this.runSynchronousAlgorithm(testArray, algorithmName);

            const end = performance.now();
            times.push(end - start);

            totalComparisons += this.comparisons;
            totalSwaps += this.swaps;

            // Verify correctness
            const expected = [...testArray].sort((a, b) => a - b);
            if (JSON.stringify(sortedArray) !== JSON.stringify(expected)) {
                console.error(`${algorithmName} produced incorrect result!`);
                return { error: 'Incorrect result' };
            }
        }

        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;

        return {
            time: avgTime,
            comparisons: Math.round(totalComparisons / iterations),
            swaps: Math.round(totalSwaps / iterations),
            success: true
        };
    }

    async runSynchronousAlgorithm(arr, algorithmName) {
        // Map algorithm names to their synchronous versions
        const syncAlgorithms = {
            bubbleSort: (arr) => {
                const n = arr.length;
                for (let i = 0; i < n - 1; i++) {
                    for (let j = 0; j < n - i - 1; j++) {
                        this.comparisons++;
                        if (arr[j] > arr[j + 1]) {
                            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                            this.swaps++;
                        }
                    }
                }
                return arr;
            },
            selectionSort: (arr) => {
                const n = arr.length;
                for (let i = 0; i < n - 1; i++) {
                    let minIndex = i;
                    for (let j = i + 1; j < n; j++) {
                        this.comparisons++;
                        if (arr[j] < arr[minIndex]) {
                            minIndex = j;
                        }
                    }
                    if (minIndex !== i) {
                        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
                        this.swaps++;
                    }
                }
                return arr;
            },
            insertionSort: (arr) => {
                const n = arr.length;
                for (let i = 1; i < n; i++) {
                    const key = arr[i];
                    let j = i - 1;
                    while (j >= 0 && arr[j] > key) {
                        this.comparisons++;
                        arr[j + 1] = arr[j];
                        this.swaps++;
                        j--;
                    }
                    arr[j + 1] = key;
                }
                return arr;
            },
            mergeSort: (arr) => {
                if (arr.length <= 1) return arr;
                const mid = Math.floor(arr.length / 2);
                const left = arr.slice(0, mid);
                const right = arr.slice(mid);
                return this.mergeSync(this.mergeSortSync(left), this.mergeSortSync(right));
            },
            quickSort: (arr) => {
                return this.quickSortSync(arr, 0, arr.length - 1);
            },
            heapSort: (arr) => {
                const n = arr.length;
                // Build max heap
                for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
                    this.heapifySync(arr, n, i);
                }
                // Extract elements
                for (let i = n - 1; i > 0; i--) {
                    [arr[0], arr[i]] = [arr[i], arr[0]];
                    this.heapifySync(arr, i, 0);
                }
                return arr;
            }
        };

        if (syncAlgorithms[algorithmName]) {
            return syncAlgorithms[algorithmName](arr);
        }

        // For other algorithms, use a simplified approach
        return arr.sort((a, b) => a - b);
    }

    // Helper synchronous methods for complex algorithms
    mergeSortSync(arr) {
        if (arr.length <= 1) return arr;
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);
        return this.mergeSync(this.mergeSortSync(left), this.mergeSortSync(right));
    }

    mergeSync(left, right) {
        const result = [];
        let i = 0, j = 0;

        while (i < left.length && j < right.length) {
            this.comparisons++;
            if (left[i] <= right[j]) {
                result.push(left[i]);
                i++;
            } else {
                result.push(right[j]);
                j++;
            }
        }

        while (i < left.length) {
            result.push(left[i]);
            i++;
        }

        while (j < right.length) {
            result.push(right[j]);
            j++;
        }

        return result;
    }

    quickSortSync(arr, low, high) {
        if (low < high) {
            const pi = this.partitionSync(arr, low, high);
            this.quickSortSync(arr, low, pi - 1);
            this.quickSortSync(arr, pi + 1, high);
        }
        return arr;
    }

    partitionSync(arr, low, high) {
        const pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            this.comparisons++;
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                this.swaps++;
            }
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        return i + 1;
    }

    heapifySync(arr, n, i) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n) {
            this.comparisons++;
            if (arr[left] > arr[largest]) {
                largest = left;
            }
        }

        if (right < n) {
            this.comparisons++;
            if (arr[right] > arr[largest]) {
                largest = right;
            }
        }

        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            this.swaps++;
            this.heapifySync(arr, n, largest);
        }
    }

    getAlgorithmDisplayName(algorithmName) {
        const names = {
            bubbleSort: 'Bubble Sort',
            selectionSort: 'Selection Sort',
            insertionSort: 'Insertion Sort',
            mergeSort: 'Merge Sort',
            quickSort: 'Quick Sort',
            heapSort: 'Heap Sort',
            countingSort: 'Counting Sort',
            radixSort: 'Radix Sort',
            bucketSort: 'Bucket Sort',
            bogoSort: 'Bogo Sort',
            cocktailSort: 'Cocktail Sort',
            combSort: 'Comb Sort',
            gnomeSort: 'Gnome Sort',
            shellSort: 'Shell Sort',
            sleepSort: 'Sleep Sort',
            smoothsort: 'Smoothsort',
            timsort: 'Timsort',
            introsort: 'Introsort'
        };
        return names[algorithmName] || algorithmName;
    }

    displayComparisonResults(results) {
        const resultsContainer = document.getElementById('comparison-results');
        if (!resultsContainer) return;

        // Create results table
        const tableHTML = `
            <div class="results-chart">
                <h3>Performance Comparison Results</h3>
                <canvas id="comparison-chart" width="600" height="400"></canvas>
            </div>

            <div class="results-table">
                <table id="results-table">
                    <thead>
                        <tr>
                            <th>Algorithm</th>
                            <th>Time (ms)</th>
                            <th>Comparisons</th>
                            <th>Swaps</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="results-body">
                        ${results.map(result => `
                            <tr>
                                <td>${result.name}</td>
                                <td>${result.error ? 'Error' : result.time.toFixed(2)}</td>
                                <td>${result.error ? 'N/A' : result.comparisons}</td>
                                <td>${result.error ? 'N/A' : result.swaps}</td>
                                <td>${result.error ? '❌ Error' : '✅ Success'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        resultsContainer.innerHTML = tableHTML;

        // Create simple bar chart
        this.createComparisonChart(results);
    }

    createComparisonChart(results) {
        const canvas = document.getElementById('comparison-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.length === 0 || results[0].error) return;

        const maxTime = Math.max(...results.map(r => r.time));
        const barHeight = 30;
        const barGap = 10;
        const startY = 50;

        results.forEach((result, index) => {
            const barWidth = (result.time / maxTime) * 400;
            const y = startY + index * (barHeight + barGap);

            // Draw bar
            ctx.fillStyle = `hsl(${(index * 360) / results.length}, 70%, 50%)`;
            ctx.fillRect(100, y, barWidth, barHeight);

            // Draw label
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px JetBrains Mono';
            ctx.textAlign = 'right';
            ctx.fillText(result.name, 90, y + 20);

            // Draw value
            ctx.textAlign = 'left';
            ctx.fillText(`${result.time.toFixed(2)}ms`, 110 + barWidth, y + 20);
        });

        // Draw axis
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(100, 30);
        ctx.lineTo(100, startY + results.length * (barHeight + barGap));
        ctx.stroke();
    }

    validateSorting(originalArray, sortedArray) {
        // Check if array is actually sorted
        for (let i = 0; i < sortedArray.length - 1; i++) {
            if (sortedArray[i] > sortedArray[i + 1]) {
                return false;
            }
        }

        // Check if all original elements are present
        const originalSorted = [...originalArray].sort((a, b) => a - b);
        return JSON.stringify(sortedArray) === JSON.stringify(originalSorted);
    }

    updateValidationDisplay() {
        if (!this.validationContainer) return;

        const isValid = this.validateSorting(this.originalArray, this.array);

        if (this.validationStatus) {
            this.validationStatus.className = isValid ? 'validation-valid' : 'validation-invalid';
        }

        if (this.validationText) {
            this.validationText.textContent = isValid ? 'Valid ✓' : 'Invalid ✗';
        }

        if (this.originalArrayDisplay) {
            this.originalArrayDisplay.textContent = `[${this.originalArray.join(', ')}]`;
        }

        if (this.sortedArrayDisplay) {
            this.sortedArrayDisplay.textContent = `[${this.array.join(', ')}]`;
        }

        if (this.expectedArrayDisplay) {
            this.expectedArrayDisplay.textContent = `[${[...this.originalArray].sort((a, b) => a - b).join(', ')}]`;
        }
    }

    // Override the play method to include validation
    async play() {
        if (!this.currentAlgorithm) {
            alert('Please select an algorithm first!');
            return;
        }

        // Store original array for validation
        this.originalArray = [...this.array];

        if (this.steps.length === 0) {
            await this.currentAlgorithm.call(this);
        } else {
            this.isPlaying = true;
            this.isPaused = false;
            this.updateControls();
            await this.playSteps();
        }

        // Update validation after sorting
        setTimeout(() => this.updateValidationDisplay(), 100);
    }

    setupEventListeners() {
        // Control buttons
        document.getElementById('play-btn')?.addEventListener('click', () => this.play());
        document.getElementById('pause-btn')?.addEventListener('click', () => this.pause());
        document.getElementById('reset-btn')?.addEventListener('click', () => this.reset());
        document.getElementById('step-btn')?.addEventListener('click', () => this.stepForward());
        document.getElementById('randomize-btn')?.addEventListener('click', () => this.generateNewArray());

        // Controls
        document.getElementById('speed-slider')?.addEventListener('input', (e) => {
            this.animationSpeed = 101 - e.target.value;
        });

        document.getElementById('size-slider')?.addEventListener('input', (e) => {
            this.arraySize = parseInt(e.target.value);
            this.generateNewArray();
        });

        // Algorithm selection
        document.querySelectorAll('.algorithm-select').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const algorithm = e.target.dataset.algorithm;
                this.selectAlgorithm(algorithm, e.target);
            });
        });

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    generateNewArray() {
        this.array = [];
        for (let i = 0; i < this.arraySize; i++) {
            this.array.push(Math.floor(Math.random() * 300) + 10);
        }
        this.currentStep = 0;
        this.steps = [];
        this.drawArray();
        this.updateCodeHighlight(0);
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth - 32;
        this.canvas.height = 400;
        this.drawArray();
    }

    drawArray(highlightedIndices = [], comparingIndices = [], swappingIndices = []) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const barWidth = this.canvas.width / this.array.length;
        const maxValue = Math.max(...this.array);

        this.array.forEach((value, index) => {
            const barHeight = (value / maxValue) * (this.canvas.height - 20);
            const x = index * barWidth;
            const y = this.canvas.height - barHeight - 10;

            // Set bar color based on state
            this.ctx.fillStyle = this.getBarColor(index, highlightedIndices, comparingIndices, swappingIndices);

            this.ctx.fillRect(x, y, barWidth - 2, barHeight);

            // Draw value on top of bar if it's large enough
            if (barWidth > 20 && barHeight > 15) {
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '12px JetBrains Mono';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
            }
        });
    }

    getBarColor(index, highlighted, comparing, swapping) {
        if (swapping.includes(index)) return '#ff0080';
        if (comparing.includes(index)) return '#ff6b35';
        if (highlighted.includes(index)) return '#00d4ff';
        return '#00ff88';
    }

    // Sorting Algorithms
    async bubbleSort() {
        const arr = [...this.array];
        this.steps = [];

        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                this.steps.push({
                    array: [...arr],
                    comparing: [j, j + 1],
                    highlighted: []
                });

                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    this.steps.push({
                        array: [...arr],
                        comparing: [],
                        swapping: [j, j + 1]
                    });
                }
            }
        }

        this.steps.push({
            array: [...arr],
            comparing: [],
            highlighted: []
        });

        await this.playSteps();
    }

    async selectionSort() {
        const arr = [...this.array];
        this.steps = [];

        for (let i = 0; i < arr.length - 1; i++) {
            let minIndex = i;

            for (let j = i + 1; j < arr.length; j++) {
                this.steps.push({
                    array: [...arr],
                    comparing: [minIndex, j],
                    highlighted: [i]
                });

                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }

            if (minIndex !== i) {
                [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
                this.steps.push({
                    array: [...arr],
                    comparing: [],
                    swapping: [i, minIndex]
                });
            }
        }

        this.steps.push({
            array: [...arr],
            comparing: [],
            highlighted: []
        });

        await this.playSteps();
    }

    async insertionSort() {
        const arr = [...this.array];
        this.steps = [];

        for (let i = 1; i < arr.length; i++) {
            const key = arr[i];
            let j = i - 1;

            this.steps.push({
                array: [...arr],
                comparing: [i],
                highlighted: [j + 1]
            });

            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                this.steps.push({
                    array: [...arr],
                    comparing: [j],
                    swapping: [j, j + 1]
                });
                j--;
            }

            arr[j + 1] = key;
        }

        this.steps.push({
            array: [...arr],
            comparing: [],
            highlighted: []
        });

        await this.playSteps();
    }

    async mergeSort() {
        const arr = [...this.array];
        this.steps = [];

        await this.mergeSortHelper(arr, 0, arr.length - 1);

        this.steps.push({
            array: [...arr],
            comparing: [],
            highlighted: []
        });

        await this.playSteps();
    }

    async mergeSortHelper(arr, left, right) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);

            await this.mergeSortHelper(arr, left, mid);
            await this.mergeSortHelper(arr, mid + 1, right);

            await this.merge(arr, left, mid, right);
        }
    }

    async merge(arr, left, mid, right) {
        const leftArray = arr.slice(left, mid + 1);
        const rightArray = arr.slice(mid + 1, right + 1);

        let i = 0, j = 0, k = left;

        while (i < leftArray.length && j < rightArray.length) {
            this.steps.push({
                array: [...arr],
                comparing: [left + i, mid + 1 + j],
                highlighted: []
            });

            if (leftArray[i] <= rightArray[j]) {
                arr[k] = leftArray[i];
                i++;
            } else {
                arr[k] = rightArray[j];
                j++;
            }
            k++;
        }

        while (i < leftArray.length) {
            arr[k] = leftArray[i];
            i++;
            k++;
        }

        while (j < rightArray.length) {
            arr[k] = rightArray[j];
            j++;
            k++;
        }
    }

    async quickSort() {
        const arr = [...this.array];
        this.steps = [];

        await this.quickSortHelper(arr, 0, arr.length - 1);

        this.steps.push({
            array: [...arr],
            comparing: [],
            highlighted: []
        });

        await this.playSteps();
    }

    async quickSortHelper(arr, low, high) {
        if (low < high) {
            const pi = await this.partition(arr, low, high);

            await this.quickSortHelper(arr, low, pi - 1);
            await this.quickSortHelper(arr, pi + 1, high);
        }
    }

    async partition(arr, low, high) {
        const pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            this.steps.push({
                array: [...arr],
                comparing: [j, high],
                highlighted: []
            });

            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                this.steps.push({
                    array: [...arr],
                    comparing: [],
                    swapping: [i, j]
                });
            }
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        this.steps.push({
            array: [...arr],
            comparing: [],
            swapping: [i + 1, high]
        });

        return i + 1;
    }

    async cocktailSort() {
        const arr = [...this.array];
        this.steps = [];

        let start = 0;
        let end = arr.length - 1;
        let swapped = true;

        while (swapped) {
            swapped = false;

            // Forward pass (left to right)
            for (let i = start; i < end; i++) {
                this.steps.push({
                    array: [...arr],
                    comparing: [i, i + 1],
                    highlighted: []
                });

                if (arr[i] > arr[i + 1]) {
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                    swapped = true;
                    this.steps.push({
                        array: [...arr],
                        comparing: [],
                        swapping: [i, i + 1]
                    });
                }
            }
            end--;

            if (!swapped) break;
            swapped = false;

            // Backward pass (right to left)
            for (let i = end; i > start; i--) {
                this.steps.push({
                    array: [...arr],
                    comparing: [i, i - 1],
                    highlighted: []
                });

                if (arr[i] < arr[i - 1]) {
                    [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
                    swapped = true;
                    this.steps.push({
                        array: [...arr],
                        comparing: [],
                        swapping: [i, i - 1]
                    });
                }
            }
            start++;
        }

        this.steps.push({
            array: [...arr],
            comparing: [],
            highlighted: []
        });

        await this.playSteps();
    }

    async heapSort() {
        const arr = [...this.array];
        this.steps = [];

        const n = arr.length;

        // Build max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await this.heapify(arr, n, i);
        }

        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
            // Move current root to end
            this.steps.push({
                array: [...arr],
                comparing: [],
                swapping: [0, i]
            });
            [arr[0], arr[i]] = [arr[i], arr[0]];

            // Call heapify on reduced heap
            await this.heapify(arr, i, 0);
        }

        this.steps.push({
            array: [...arr],
            comparing: [],
            highlighted: []
        });

        await this.playSteps();
    }

    async heapify(arr, n, i) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        // If left child is larger than root
        if (left < n) {
            this.steps.push({
                array: [...arr],
                comparing: [left, largest],
                highlighted: []
            });

            if (arr[left] > arr[largest]) {
                largest = left;
            }
        }

        // If right child is larger than largest so far
        if (right < n) {
            this.steps.push({
                array: [...arr],
                comparing: [right, largest],
                highlighted: []
            });

            if (arr[right] > arr[largest]) {
                largest = right;
            }
        }

        // If largest is not root
        if (largest !== i) {
            this.steps.push({
                array: [...arr],
                comparing: [],
                swapping: [i, largest]
            });
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            await this.heapify(arr, n, largest);
        }
    }

    async bogoSort() {
        const arr = [...this.array];
        this.steps = [];

        let attempts = 0;
        let isArraySorted = false;

        // Keep trying until sorted
        while (!isArraySorted) {
            attempts++;

            // Add current state before shuffle
            this.steps.push({
                array: [...arr],
                comparing: [],
                highlighted: []
            });

            // Randomly shuffle the array
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }

            // Check if sorted
            isArraySorted = true;
            for (let i = 0; i < arr.length - 1; i++) {
                if (arr[i] > arr[i + 1]) {
                    isArraySorted = false;
                    break;
                }
            }

            // If sorted, add final state
            if (isArraySorted) {
                this.steps.push({
                    array: [...arr],
                    comparing: [],
                    highlighted: []
                });
                console.log(`Bogo Sort completed after ${attempts} attempts!`);
            }

            // Limit attempts to prevent infinite loops
            if (attempts > 1000) {
                alert(`Bogo Sort failed to complete after ${attempts} attempts. This demonstrates why it's not a practical algorithm!`);
                break;
            }
        }

        await this.playSteps();
    }

    async timsort() {
        const arr = [...this.array];
        this.steps = [];

        const RUN = 32; // Size of runs to be sorted with insertion sort

        // Sort individual subarrays of size RUN
        for (let i = 0; i < arr.length; i += RUN) {
            this.steps.push({
                array: [...arr],
                comparing: [],
                highlighted: [i, Math.min(i + RUN - 1, arr.length - 1)]
            });
            await this.insertionSortRun(arr, i, Math.min(i + RUN - 1, arr.length - 1));
        }

        // Merge runs using merge sort logic
        for (let size = RUN; size < arr.length; size = 2 * size) {
            for (let left = 0; left < arr.length; left += 2 * size) {
                const mid = left + size - 1;
                const right = Math.min(left + 2 * size - 1, arr.length - 1);

                if (mid < right) {
                    this.steps.push({
                        array: [...arr],
                        comparing: [left, right],
                        highlighted: []
                    });
                    await this.mergeRuns(arr, left, mid, right);
                }
            }
        }

        this.steps.push({
            array: [...arr],
            comparing: [],
            highlighted: []
        });

        await this.playSteps();
    }

    async shellSort() {
        const arr = [...this.array];
        this.steps = [];

        const n = arr.length;

        // Start with large gap, reduce to 1
        for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
            this.steps.push({
                array: [...arr],
                comparing: [],
                highlighted: []
            });

            // Perform insertion sort for this gap size
            for (let i = gap; i < n; i++) {
                const temp = arr[i];
                let j;

                this.steps.push({
                    array: [...arr],
                    comparing: [i],
                    highlighted: [j]
                });

                // Shift elements that are gap positions apart
                for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                    this.steps.push({
                        array: [...arr],
                        comparing: [j - gap],
                        swapping: [j, j - gap]
                    });
                    arr[j] = arr[j - gap];
                }

                arr[j] = temp;
            }
        }

        this.steps.push({
            array: [...arr],
            comparing: [],
            highlighted: []
        });

        await this.playSteps();
    }

    async combSort() {
        const arr = [...this.array];
        this.steps = [];

        const n = arr.length;
        const shrink = 1.3; // Shrink factor
        let gap = n;
        let sorted = false;

        while (!sorted) {
            this.steps.push({
                array: [...arr],
                comparing: [],
                highlighted: []
            });

            // Update gap using shrink factor
            gap = Math.floor(gap / shrink);

            // Minimum gap is 1
            if (gap <= 1) {
                gap = 1;
                sorted = true;
            }

            // Compare elements with current gap
            for (let i = 0; i < n - gap; i++) {
                this.steps.push({
                    array: [...arr],
                    comparing: [i, i + gap],
                    highlighted: []
                });

                if (arr[i] > arr[i + gap]) {
                    // Swap elements
                    this.steps.push({
                        array: [...arr],
                        comparing: [],
                        swapping: [i, i + gap]
                    });
                    [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
                    sorted = false; // Array was not sorted
                }
            }
        }

        this.steps.push({
            array: [...arr],
            comparing: [],
            highlighted: []
        });

        await this.playSteps();
    }

    async bucketSort() {
        const arr = [...this.array];
        this.steps = [];

        if (arr.length === 0) {
            await this.playSteps();
            return;
        }

        this.steps.push({
            array: [...arr],
            comparing: [],
            highlighted: []
        });

        // Find min and max values
        const min = Math.min(...arr);
        const max = Math.max(...arr);

        // Initialize buckets
        const bucketCount = Math.floor(Math.sqrt(arr.length)) + 1;
        const buckets = Array.from({ length: bucketCount }, () => []);

        // Distribute elements into buckets
        for (let i = 0; i < arr.length; i++) {
            const bucketIndex = Math.floor(
                ((arr[i] - min) / (max - min + 1)) * bucketCount
            );
            buckets[Math.min(bucketIndex, bucketCount - 1)].push(arr[i]);
        }

        // Sort each bucket and combine
        let sortedIndex = 0;
        for (let i = 0; i < buckets.length; i++) {
            // Sort individual bucket using insertion sort
            for (let j = 1; j < buckets[i].length; j++) {
                const key = buckets[i][j];
                let k = j - 1;

                while (k >= 0 && buckets[i][k] > key) {
                    buckets[i][k + 1] = buckets[i][k];
                    k--;
                }
                buckets[i][k + 1] = key;
            }

            // Copy sorted bucket back to original array
            for (let j = 0; j < buckets[i].length; j++) {
                arr[sortedIndex++] = buckets[i][j];
            }
        }

        this.steps.push({
            array: [...arr],
            comparing: [],
            highlighted: []
        });

        await this.playSteps();
    }

    async sleepSort() {
        const arr = [...this.array];
        this.steps = [];

        // Sleep Sort simulation for browser environment
        // In a real implementation, this would use actual threads/timers

        this.steps.push({
            array: [...arr],
            comparing: [],
            highlighted: []
        });

        // Simulate the "sleeping" process
        // Elements with smaller values "wake up" first
        const sortedElements = [...arr].sort((a, b) => a - b);

        // Simulate the timing-based output
        for (let i = 0; i < sortedElements.length; i++) {
            this.steps.push({
                array: [...arr],
                comparing: [],
                highlighted: [arr.indexOf(sortedElements[i])]
            });

            // Find the position where this element should be in the sorted array
            const targetIndex = i;
            if (targetIndex < arr.length) {
                // Simulate the element "waking up" and being placed
                const currentElement = arr[targetIndex];
                arr[targetIndex] = sortedElements[i];

                this.steps.push({
                    array: [...arr],
                    comparing: [],
                    highlighted: [targetIndex]
                });
            }
        }

        this.steps.push({
            array: [...arr],
            comparing: [],
            highlighted: []
        });

        await this.playSteps();
    }

    async insertionSortRun(arr, left, right) {
        for (let i = left + 1; i <= right; i++) {
            const temp = arr[i];
            let j = i - 1;

            this.steps.push({
                array: [...arr],
                comparing: [i],
                highlighted: [j + 1]
            });

            while (j >= left && arr[j] > temp) {
                arr[j + 1] = arr[j];
                this.steps.push({
                    array: [...arr],
                    comparing: [j],
                    swapping: [j, j + 1]
                });
                j--;
            }

            arr[j + 1] = temp;
        }
    }

    async mergeRuns(arr, left, mid, right) {
        const leftArray = arr.slice(left, mid + 1);
        const rightArray = arr.slice(mid + 1, right + 1);

        let i = 0, j = 0, k = left;

        while (i < leftArray.length && j < rightArray.length) {
            this.steps.push({
                array: [...arr],
                comparing: [left + i, mid + 1 + j],
                highlighted: []
            });

            if (leftArray[i] <= rightArray[j]) {
                arr[k] = leftArray[i];
                i++;
            } else {
                arr[k] = rightArray[j];
                j++;
            }
            k++;
        }

        while (i < leftArray.length) {
            arr[k] = leftArray[i];
            i++;
            k++;
        }

        while (j < rightArray.length) {
            arr[k] = rightArray[j];
            j++;
            k++;
        }
    }

    async radixSort() {
        const arr = [...this.array];
        this.steps = [];

        // Find the maximum number to determine number of digits
        const max = Math.max(...arr);
        const digits = max.toString().length;

        // Perform counting sort for each digit
        for (let digit = 0; digit < digits; digit++) {
            this.steps.push({
                array: [...arr],
                comparing: [],
                highlighted: []
            });
            await this.countingSortByDigit(arr, digit);
        }

        this.steps.push({
            array: [...arr],
            comparing: [],
            highlighted: []
        });

        await this.playSteps();
    }

    async countingSortByDigit(arr, digit) {
        const n = arr.length;
        const output = new Array(n);
        const count = new Array(10).fill(0);

        // Count occurrences of each digit (0-9)
        for (let i = 0; i < n; i++) {
            const digitValue = this.getDigit(arr[i], digit);
            count[digitValue]++;
        }

        // Cumulative count
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        // Build output array
        for (let i = n - 1; i >= 0; i--) {
            const digitValue = this.getDigit(arr[i], digit);
            output[count[digitValue] - 1] = arr[i];
            count[digitValue]--;
        }

        // Copy back to original array
        for (let i = 0; i < n; i++) {
            arr[i] = output[i];
        }
    }

    getDigit(num, digit) {
        return Math.floor(Math.abs(num) / Math.pow(10, digit)) % 10;
    }

    async gnomeSort() {
        const arr = [...this.array];
        this.steps = [];

        let i = 0;

        while (i < arr.length) {
            this.steps.push({
                array: [...arr],
                comparing: i > 0 ? [i, i - 1] : [i],
                highlighted: [i]
            });

            // If at beginning or current element is larger than previous
            if (i === 0 || arr[i] >= arr[i - 1]) {
                i++; // Move to next element (gnome takes a step forward)
            } else {
                // Current element is smaller than previous
                // Swap elements (gnome swaps pots)
                this.steps.push({
                    array: [...arr],
                    comparing: [],
                    swapping: [i, i - 1]
                });
                [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
                i--; // Move back to check previous elements

                // If we've moved back to the beginning, take a step forward
                if (i === 0) {
                    i++;
                }
            }
        }

        this.steps.push({
            array: [...arr],
            comparing: [],
            highlighted: []
        });

        await this.playSteps();
    }

    async smoothsort() {
        const arr = [...this.array];
        this.steps = [];

        // Smoothsort uses Leonardo numbers for heap sizes
        const leonardoNumbers = [1, 1, 3, 5, 9, 15, 25, 41, 67, 109, 177, 287, 465, 753, 1219, 1973, 3193, 5167, 8361];

        // Find the largest Leonardo number that fits our array
        let size = arr.length;
        let leoIndex = 0;
        for (let i = 0; i < leonardoNumbers.length; i++) {
            if (leonardoNumbers[i] <= size) {
                leoIndex = i;
            } else {
                break;
            }
        }

        // Initialize heap structure
        const heaps = [];
        let currentSize = 0;

        // Build initial heaps
        for (let i = 0; i < arr.length; i++) {
            this.steps.push({
                array: [...arr],
                comparing: [],
                highlighted: [i]
            });

            // Add element as a single-element heap
            heaps.push(1);
            currentSize++;

            // Merge heaps if necessary to maintain Leonardo property
            while (heaps.length >= 2 && heaps[heaps.length - 2] === heaps[heaps.length - 1]) {
                // Merge two equal-sized heaps
                const mergedSize = heaps.pop() + heaps.pop() + 1;
                heaps.push(mergedSize);

                this.steps.push({
                    array: [...arr],
                    comparing: [],
                    highlighted: [i]
                });
            }
        }

        // Sort by repeatedly removing the largest element
        while (currentSize > 0) {
            // Find the root of the largest heap (last heap in array)
            const largestHeapSize = heaps[heaps.length - 1];
            const largestHeapStart = arr.length - currentSize;

            this.steps.push({
                array: [...arr],
                comparing: [],
                highlighted: [largestHeapStart]
            });

            // Remove the largest element (root of largest heap)
            const maxValue = arr[largestHeapStart];

            // Find the position where this element should go in sorted order
            let insertPos = arr.length - currentSize;
            for (let i = largestHeapStart + 1; i < arr.length - currentSize + largestHeapSize; i++) {
                if (arr[i] > maxValue) {
                    insertPos = i - largestHeapStart + largestHeapStart;
                    break;
                }
            }

            // Swap the max element to its correct position
            if (insertPos !== largestHeapStart) {
                this.steps.push({
                    array: [...arr],
                    comparing: [],
                    swapping: [largestHeapStart, insertPos]
                });
                [arr[largestHeapStart], arr[insertPos]] = [arr[insertPos], arr[largestHeapStart]];
            }

            // Update heap structure after removal
            currentSize--;
            if (heaps.length > 0) {
                const removedSize = heaps.pop();
                if (removedSize > 1) {
                    // Split the heap back into smaller heaps
                    const split1 = Math.floor((removedSize - 1) / 2);
                    const split2 = removedSize - 1 - split1;

                    if (split1 > 0) heaps.push(split1);
                    if (split2 > 0) heaps.push(split2);
                }
            }
        }

        this.steps.push({
            array: [...arr],
            comparing: [],
            highlighted: []
        });

        await this.playSteps();
    }

    async introsort() {
        const arr = [...this.array];
        this.steps = [];

        const maxDepth = 2 * Math.floor(Math.log2(arr.length));

        await this.introsortHelper(arr, 0, arr.length - 1, maxDepth);

        this.steps.push({
            array: [...arr],
            comparing: [],
            highlighted: []
        });

        await this.playSteps();
    }

    async introsortHelper(arr, low, high, depthLimit) {
        if (high - low <= 16) {
            // Use insertion sort for small subarrays
            await this.insertionSortRange(arr, low, high);
        } else if (depthLimit === 0) {
            // Switch to heapsort when depth limit reached
            await this.heapSortRange(arr, low, high);
        } else {
            // Use quicksort with median-of-three pivot selection
            const pivotIndex = await this.introsortPartition(arr, low, high);

            if (pivotIndex > low) {
                await this.introsortHelper(arr, low, pivotIndex - 1, depthLimit - 1);
            }

            if (pivotIndex < high) {
                await this.introsortHelper(arr, pivotIndex + 1, high, depthLimit - 1);
            }
        }
    }

    async introsortPartition(arr, low, high) {
        // Median-of-three pivot selection
        const mid = Math.floor((low + high) / 2);

        // Find median among low, mid, high
        const a = arr[low], b = arr[mid], c = arr[high];

        let medianIndex;
        if (a < b) {
            if (b < c) medianIndex = mid;
            else if (a < c) medianIndex = high;
            else medianIndex = low;
        } else {
            if (a < c) medianIndex = low;
            else if (b < c) medianIndex = high;
            else medianIndex = mid;
        }

        // Place median at end for partitioning
        this.steps.push({
            array: [...arr],
            comparing: [],
            swapping: [medianIndex, high]
        });
        [arr[medianIndex], arr[high]] = [arr[high], arr[medianIndex]];

        const pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            this.steps.push({
                array: [...arr],
                comparing: [j, high],
                highlighted: []
            });

            if (arr[j] <= pivot) {
                i++;
                if (i !== j) {
                    this.steps.push({
                        array: [...arr],
                        comparing: [],
                        swapping: [i, j]
                    });
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
            }
        }

        // Place pivot in correct position
        this.steps.push({
            array: [...arr],
            comparing: [],
            swapping: [i + 1, high]
        });
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

        return i + 1;
    }

    async insertionSortRange(arr, low, high) {
        for (let i = low + 1; i <= high; i++) {
            const key = arr[i];
            let j = i - 1;

            this.steps.push({
                array: [...arr],
                comparing: [i],
                highlighted: [j + 1]
            });

            while (j >= low && arr[j] > key) {
                arr[j + 1] = arr[j];
                this.steps.push({
                    array: [...arr],
                    comparing: [j],
                    swapping: [j, j + 1]
                });
                j--;
            }

            arr[j + 1] = key;
        }
    }

    async heapSortRange(arr, low, high) {
        const n = high - low + 1;

        // Build max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await this.heapifyRange(arr, low, high, i);
        }

        // Extract elements from heap
        for (let i = n - 1; i > 0; i--) {
            // Move current root to end
            this.steps.push({
                array: [...arr],
                comparing: [],
                swapping: [low, low + i]
            });
            [arr[low], arr[low + i]] = [arr[low + i], arr[low]];

            // Heapify reduced heap
            await this.heapifyRange(arr, low, low + i - 1, 0);
        }
    }

    async heapifyRange(arr, low, high, i) {
        const n = high - low + 1;
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        // Compare with left child
        if (left < n) {
            this.steps.push({
                array: [...arr],
                comparing: [low + left, low + largest],
                highlighted: []
            });

            if (arr[low + left] > arr[low + largest]) {
                largest = left;
            }
        }

        // Compare with right child
        if (right < n) {
            this.steps.push({
                array: [...arr],
                comparing: [low + right, low + largest],
                highlighted: []
            });

            if (arr[low + right] > arr[low + largest]) {
                largest = right;
            }
        }

        // If largest is not root, swap and continue heapifying
        if (largest !== i) {
            this.steps.push({
                array: [...arr],
                comparing: [],
                swapping: [low + i, low + largest]
            });
            [arr[low + i], arr[low + largest]] = [arr[low + largest], arr[low + i]];
            await this.heapifyRange(arr, low, high, largest);
        }
    }

    async playSteps() {
        this.isPlaying = true;
        this.updateControls();

        for (let i = 0; i < this.steps.length; i++) {
            if (!this.isPlaying) break;

            while (this.isPaused && this.isPlaying) {
                await this.sleep(100);
            }

            this.currentStep = i;
            this.array = [...this.steps[i].array];
            this.drawArray(
                this.steps[i].highlighted,
                this.steps[i].comparing,
                this.steps[i].swapping
            );

            this.updateCodeHighlight(i);
            await this.sleep(this.animationSpeed);
        }

        this.isPlaying = false;
        this.updateControls();
    }

    async play() {
        if (!this.currentAlgorithm) {
            alert('Please select an algorithm first!');
            return;
        }

        if (this.steps.length === 0) {
            await this.currentAlgorithm.call(this);
        } else {
            this.isPlaying = true;
            this.isPaused = false;
            this.updateControls();
            await this.playSteps();
        }
    }

    pause() {
        this.isPaused = !this.isPaused;
        this.updateControls();
    }

    reset() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.steps = [];
        this.generateNewArray();
        this.updateControls();
    }

    stepForward() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.array = [...this.steps[this.currentStep].array];
            this.drawArray(
                this.steps[this.currentStep].highlighted,
                this.steps[this.currentStep].comparing,
                this.steps[this.currentStep].swapping
            );
            this.updateCodeHighlight(this.currentStep);
        }
    }

    selectAlgorithm(algorithm) {
        this.currentAlgorithm = this[algorithm].bind(this);
        this.reset();

        // Update UI
        document.querySelectorAll('.algorithm-select').forEach(btn => {
            btn.classList.remove('active');
        });
        // Note: event parameter would be passed from the calling context
    }

    updateControls() {
        const playBtn = document.getElementById('play-btn');
        const pauseBtn = document.getElementById('pause-btn');

        if (playBtn && pauseBtn) {
            playBtn.style.display = this.isPlaying ? 'none' : 'block';
            pauseBtn.style.display = this.isPlaying ? 'block' : 'none';
            pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
        }
    }

    updateCodeHighlight(stepIndex) {
        if (this.codeContainer) {
            const lines = this.codeContainer.querySelectorAll('.code-line');
            lines.forEach((line, index) => {
                line.classList.toggle('highlighted', index === stepIndex);
            });
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Educational Features Implementation
    initializeEducationalFeatures() {
        this.loadLearningProgress();
        this.setupQuizSystem();
        this.setupCodePlayground();
        this.setupProgressTracking();
        this.updateProgressDisplay();
    }

    // Progress Tracking System
    loadLearningProgress() {
        const saved = localStorage.getItem('sortingVisualizerProgress');
        if (saved) {
            this.learningProgress = { ...this.learningProgress, ...JSON.parse(saved) };
        }
    }

    saveLearningProgress() {
        localStorage.setItem('sortingVisualizerProgress', JSON.stringify(this.learningProgress));
    }

    updateProgressDisplay() {
        // Update stats
        const algorithmsMastered = document.getElementById('algorithms-mastered');
        const quizScore = document.getElementById('quiz-score');
        const studyStreak = document.getElementById('study-streak');
        const totalStudyTime = document.getElementById('total-study-time');

        if (algorithmsMastered) algorithmsMastered.textContent = this.learningProgress.algorithmsMastered;
        if (quizScore) quizScore.textContent = this.calculateAverageQuizScore() + '%';
        if (studyStreak) studyStreak.textContent = this.learningProgress.studyStreak;
        if (totalStudyTime) totalStudyTime.textContent = Math.floor(this.learningProgress.totalStudyTime / 60) + 'h';

        // Update progress bars
        this.updateProgressBars();
        this.updateAchievements();
    }

    updateProgressBars() {
        const simpleProgress = document.getElementById('simple-progress');
        const efficientProgress = document.getElementById('efficient-progress');
        const hybridProgress = document.getElementById('hybrid-progress');
        const distributionProgress = document.getElementById('distribution-progress');
        const educationalProgress = document.getElementById('educational-progress');

        if (simpleProgress) {
            const percent = (this.learningProgress.categoryProgress.simple / 5) * 100;
            simpleProgress.style.width = percent + '%';
            simpleProgress.parentElement.nextElementSibling.textContent = `${this.learningProgress.categoryProgress.simple}/5 Completed`;
        }

        if (efficientProgress) {
            const percent = (this.learningProgress.categoryProgress.efficient / 6) * 100;
            efficientProgress.style.width = percent + '%';
            efficientProgress.parentElement.nextElementSibling.textContent = `${this.learningProgress.categoryProgress.efficient}/6 Completed`;
        }

        if (hybridProgress) {
            const percent = (this.learningProgress.categoryProgress.hybrid / 2) * 100;
            hybridProgress.style.width = percent + '%';
            hybridProgress.parentElement.nextElementSibling.textContent = `${this.learningProgress.categoryProgress.hybrid}/2 Completed`;
        }

        if (distributionProgress) {
            const percent = (this.learningProgress.categoryProgress.distribution / 3) * 100;
            distributionProgress.style.width = percent + '%';
            distributionProgress.parentElement.nextElementSibling.textContent = `${this.learningProgress.categoryProgress.distribution}/3 Completed`;
        }

        if (educationalProgress) {
            const percent = (this.learningProgress.categoryProgress.educational / 2) * 100;
            educationalProgress.style.width = percent + '%';
            educationalProgress.parentElement.nextElementSibling.textContent = `${this.learningProgress.categoryProgress.educational}/2 Completed`;
        }
    }

    updateAchievements() {
        const badgesContainer = document.getElementById('achievement-badges');
        if (!badgesContainer) return;

        const achievements = [
            {
                id: 'first-steps',
                name: 'First Steps',
                description: 'Complete your first algorithm',
                condition: () => this.learningProgress.algorithmsMastered >= 1,
                icon: '🎯'
            },
            {
                id: 'speed-demon',
                name: 'Speed Demon',
                description: 'Master 5 algorithms',
                condition: () => this.learningProgress.algorithmsMastered >= 5,
                icon: '⚡'
            },
            {
                id: 'quiz-master',
                name: 'Quiz Master',
                description: 'Score 100% on 3 quizzes',
                condition: () => this.learningProgress.quizScores.filter(score => score === 100).length >= 3,
                icon: '🧠'
            }
        ];

        badgesContainer.innerHTML = '';

        achievements.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = `badge ${achievement.condition() ? 'unlocked' : 'locked'}`;
            badge.innerHTML = `
                <span class="badge-icon">${achievement.condition() ? achievement.icon : '🔒'}</span>
                <span class="badge-name">${achievement.name}</span>
                <span class="badge-desc">${achievement.description}</span>
            `;
            badgesContainer.appendChild(badge);
        });
    }

    markAlgorithmCompleted(algorithmName) {
        if (!this.learningProgress.completedAlgorithms) {
            this.learningProgress.completedAlgorithms = [];
        }

        if (!this.learningProgress.completedAlgorithms.includes(algorithmName)) {
            this.learningProgress.completedAlgorithms.push(algorithmName);
            this.learningProgress.algorithmsMastered++;

            // Update category progress
            this.updateCategoryProgress(algorithmName);

            this.saveLearningProgress();
            this.updateProgressDisplay();

            // Show achievement notification
            this.showNotification(`🎉 Algorithm Mastered: ${algorithmName}!`);
        }
    }

    updateCategoryProgress(algorithmName) {
        const categories = {
            'bubble': 'simple', 'selection': 'simple', 'insertion': 'simple',
            'gnome': 'simple', 'cocktail': 'simple',
            'merge': 'efficient', 'quick': 'efficient', 'heap': 'efficient',
            'shell': 'efficient', 'comb': 'efficient', 'smooth': 'efficient',
            'timsort': 'hybrid', 'introsort': 'hybrid',
            'counting': 'distribution', 'radix': 'distribution', 'bucket': 'distribution',
            'bogo': 'educational', 'sleep': 'educational'
        };

        const category = categories[algorithmName];
        if (category && this.learningProgress.categoryProgress[category] < this.getMaxForCategory(category)) {
            this.learningProgress.categoryProgress[category]++;
        }
    }

    getMaxForCategory(category) {
        const maxes = { simple: 5, efficient: 6, hybrid: 2, distribution: 3, educational: 2 };
        return maxes[category] || 0;
    }

    calculateAverageQuizScore() {
        if (this.learningProgress.quizScores.length === 0) return 0;
        const sum = this.learningProgress.quizScores.reduce((a, b) => a + b, 0);
        return Math.round(sum / this.learningProgress.quizScores.length);
    }

    // Quiz System
    setupQuizSystem() {
        const startQuizBtn = document.getElementById('start-quiz');
        const restartQuizBtn = document.getElementById('restart-quiz');
        const nextQuestionBtn = document.getElementById('next-question');

        if (startQuizBtn) startQuizBtn.addEventListener('click', () => this.startQuiz());
        if (restartQuizBtn) restartQuizBtn.addEventListener('click', () => this.startQuiz());
        if (nextQuestionBtn) nextQuestionBtn.addEventListener('click', () => this.nextQuestion());

        this.initializeQuizQuestions();
    }

    initializeQuizQuestions() {
        this.quizQuestions = [
            {
                question: "Which algorithm has the worst-case time complexity of O(n²) but performs well on nearly sorted data?",
                options: ["Bubble Sort", "Insertion Sort", "Selection Sort", "Quick Sort"],
                correct: 1,
                explanation: "Insertion Sort is O(n²) in worst case but O(n) on nearly sorted data, making it very efficient for partially sorted arrays."
            },
            {
                question: "Which algorithm is NOT a comparison-based sorting algorithm?",
                options: ["Merge Sort", "Counting Sort", "Quick Sort", "Heap Sort"],
                correct: 1,
                explanation: "Counting Sort is not comparison-based; it works by counting occurrences of each value, making it O(n) for small ranges."
            },
            {
                question: "What is the main advantage of Timsort over pure Merge Sort?",
                options: ["Faster worst-case", "Less memory usage", "Better performance on real-world data", "Simpler implementation"],
                correct: 2,
                explanation: "Timsort performs better on real-world data because it exploits existing order in the input array through adaptive merging."
            },
            {
                question: "Which algorithm uses a pivot element to partition the array?",
                options: ["Merge Sort", "Quick Sort", "Insertion Sort", "Bubble Sort"],
                correct: 1,
                explanation: "Quick Sort uses a pivot element and partitions the array around it, recursively sorting the subarrays."
            },
            {
                question: "What makes Introsort different from regular Quicksort?",
                options: ["Uses insertion sort for large arrays", "Switches to heapsort when recursion gets deep", "Always uses O(n log n) space", "Never uses pivot selection"],
                correct: 1,
                explanation: "Introsort monitors recursion depth and switches to heapsort if it gets too deep, preventing O(n²) worst-case behavior."
            },
            {
                question: "Which algorithm is considered 'adaptive'?",
                options: ["Bubble Sort", "Insertion Sort", "Selection Sort", "All of the above"],
                correct: 1,
                explanation: "Insertion Sort is adaptive because it takes advantage of existing order in the input, performing better on partially sorted data."
            },
            {
                question: "What is the primary data structure used by Heap Sort?",
                options: ["Stack", "Queue", "Binary Heap", "Linked List"],
                correct: 2,
                explanation: "Heap Sort uses a binary heap data structure to efficiently find and extract the maximum element repeatedly."
            },
            {
                question: "Which algorithm has the best theoretical performance but is rarely used in practice?",
                options: ["Radix Sort", "Bucket Sort", "Smoothsort", "Timsort"],
                correct: 2,
                explanation: "Smoothsort has excellent theoretical properties but is complex to implement and rarely used in practice due to its complexity."
            },
            {
                question: "What is 'stability' in sorting algorithms?",
                options: ["Algorithm doesn't crash", "Equal elements maintain relative order", "Algorithm runs in O(n log n) time", "Algorithm uses O(1) space"],
                correct: 1,
                explanation: "A stable sorting algorithm maintains the relative order of equal elements, which is important for multi-key sorting."
            },
            {
                question: "Which algorithm would you choose for sorting a large file that doesn't fit in memory?",
                options: ["Quick Sort", "Merge Sort", "Bubble Sort", "Insertion Sort"],
                correct: 1,
                explanation: "Merge Sort is ideal for external sorting because it can efficiently merge sorted chunks from disk storage."
            }
        ];
    }

    startQuiz() {
        this.quizData.currentQuestion = 0;
        this.quizData.score = 0;
        this.quizData.timeLeft = 30;

        this.showQuizSection();
        this.displayQuestion();
        this.startQuizTimer();
    }

    showQuizSection() {
        // Hide other sections
        const sections = ['progress', 'algorithms', 'playground', 'comparison-tool'];
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) element.style.display = 'none';
        });

        // Show quiz section
        const quizSection = document.getElementById('quiz');
        if (quizSection) quizSection.style.display = 'block';
    }

    displayQuestion() {
        const question = this.quizQuestions[this.quizData.currentQuestion];
        if (!question) return;

        const questionElement = document.getElementById('quiz-question');
        const optionsElement = document.getElementById('quiz-options');
        const questionNumberElement = document.getElementById('question-number');
        const totalQuestionsElement = document.getElementById('total-questions');
        const currentScoreElement = document.getElementById('current-score');

        if (questionNumberElement) questionNumberElement.textContent = this.quizData.currentQuestion + 1;
        if (totalQuestionsElement) totalQuestionsElement.textContent = this.quizQuestions.length;
        if (currentScoreElement) currentScoreElement.textContent = this.quizData.score;

        if (questionElement) {
            questionElement.innerHTML = `<h3>${question.question}</h3>`;
        }

        if (optionsElement) {
            optionsElement.innerHTML = '';
            question.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'quiz-option';
                optionDiv.innerHTML = `
                    <input type="radio" name="quiz-option" value="${index}" id="option-${index}">
                    <label for="option-${index}">${option}</label>
                `;
                optionsElement.appendChild(optionDiv);
            });
        }

        // Hide feedback section
        const feedbackSection = document.getElementById('quiz-feedback');
        if (feedbackSection) feedbackSection.style.display = 'none';
    }

    startQuizTimer() {
        const timerElement = document.getElementById('quiz-timer');
        if (!timerElement) return;

        this.quizTimer = setInterval(() => {
            this.quizData.timeLeft--;
            timerElement.textContent = this.quizData.timeLeft;

            if (this.quizData.timeLeft <= 0) {
                this.handleTimeUp();
            }
        }, 1000);
    }

    handleTimeUp() {
        clearInterval(this.quizTimer);
        this.checkAnswer(); // Auto-submit with current selection
    }

    checkAnswer() {
        clearInterval(this.quizTimer);

        const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
        const question = this.quizQuestions[this.quizData.currentQuestion];
        const feedbackSection = document.getElementById('quiz-feedback');
        const feedbackContent = feedbackSection.querySelector('.feedback-content');

        let isCorrect = false;

        if (selectedOption) {
            const selectedValue = parseInt(selectedOption.value);
            isCorrect = selectedValue === question.correct;

            if (isCorrect) {
                this.quizData.score++;
                this.playSound(800, 200); // Success sound
            } else {
                this.playSound(200, 300); // Error sound
            }
        }

        if (feedbackContent) {
            feedbackContent.innerHTML = `
                <h4>${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</h4>
                <p>${question.explanation}</p>
                <p><strong>Your Score: ${this.quizData.score}/${this.quizData.currentQuestion + 1}</strong></p>
            `;
        }

        if (feedbackSection) feedbackSection.style.display = 'block';
    }

    nextQuestion() {
        this.quizData.currentQuestion++;

        if (this.quizData.currentQuestion >= this.quizQuestions.length) {
            this.endQuiz();
        } else {
            this.displayQuestion();
            this.quizData.timeLeft = 30;
            this.startQuizTimer();
        }
    }

    endQuiz() {
        const finalScore = Math.round((this.quizData.score / this.quizQuestions.length) * 100);

        // Save quiz score
        this.learningProgress.quizScores.push(finalScore);
        this.saveLearningProgress();
        this.updateProgressDisplay();

        const questionElement = document.getElementById('quiz-question');
        const optionsElement = document.getElementById('quiz-options');
        const feedbackSection = document.getElementById('quiz-feedback');
        const restartBtn = document.getElementById('restart-quiz');

        if (questionElement) {
            questionElement.innerHTML = `
                <h3>Quiz Complete! 🎉</h3>
                <p>Your final score: <strong>${this.quizData.score}/${this.quizQuestions.length} (${finalScore}%)</strong></p>
                <p>${this.getQuizFeedback(finalScore)}</p>
            `;
        }

        if (optionsElement) optionsElement.style.display = 'none';
        if (feedbackSection) feedbackSection.style.display = 'none';
        if (restartBtn) restartBtn.style.display = 'block';

        // Show quiz history
        this.updateQuizHistory();
    }

    getQuizFeedback(score) {
        if (score >= 90) return "Outstanding! You're a sorting algorithm expert! 🏆";
        if (score >= 80) return "Excellent work! You have a strong understanding of sorting algorithms! ⭐";
        if (score >= 70) return "Good job! Keep practicing to master all the concepts! 📚";
        if (score >= 60) return "Not bad! Review the explanations and try again! 💪";
        return "Keep learning! Every expert was once a beginner! 🌟";
    }

    updateQuizHistory() {
        const historyContainer = document.getElementById('quiz-history');
        const historyList = document.getElementById('history-list');

        if (historyContainer) historyContainer.style.display = 'block';

        if (historyList) {
            const recentScores = this.learningProgress.quizScores.slice(-5);
            historyList.innerHTML = '';

            recentScores.forEach((score, index) => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <span class="history-date">Quiz ${this.learningProgress.quizScores.length - 4 + index}</span>
                    <span class="history-score ${score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'needs-improvement'}">${score}%</span>
                `;
                historyList.appendChild(historyItem);
            });
        }
    }

    // Code Playground
    setupCodePlayground() {
        const algorithmSelect = document.getElementById('algorithm-select');
        const loadTemplateBtn = document.getElementById('load-template');
        const resetCodeBtn = document.getElementById('reset-code');
        const runCodeBtn = document.getElementById('run-code');
        const codeEditor = document.getElementById('code-editor');

        if (algorithmSelect) algorithmSelect.addEventListener('change', (e) => this.changePlaygroundAlgorithm(e.target.value));
        if (loadTemplateBtn) loadTemplateBtn.addEventListener('click', () => this.loadCodeTemplate());
        if (resetCodeBtn) resetCodeBtn.addEventListener('click', () => this.resetPlaygroundCode());
        if (runCodeBtn) runCodeBtn.addEventListener('click', () => this.runPlaygroundCode());
        if (codeEditor) codeEditor.addEventListener('input', () => this.updatePlaygroundStatus());
    }

    changePlaygroundAlgorithm(algorithm) {
        this.codePlayground.currentAlgorithm = algorithm;
        this.loadCodeTemplate();
    }

    loadCodeTemplate() {
        const templates = {
            bubble: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}`,

            selection: `function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
    return arr;
}`,

            insertion: `function insertionSort(arr) {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`
        };

        const codeEditor = document.getElementById('code-editor');
        if (codeEditor && templates[this.codePlayground.currentAlgorithm]) {
            codeEditor.textContent = templates[this.codePlayground.currentAlgorithm];
            this.updatePlaygroundStatus();
        }
    }

    resetPlaygroundCode() {
        this.loadCodeTemplate();
    }

    updatePlaygroundStatus() {
        const codeEditor = document.getElementById('code-editor');
        const statusElement = document.getElementById('editor-status');

        if (codeEditor && statusElement) {
            this.codePlayground.userCode = codeEditor.textContent;
            statusElement.textContent = 'Code updated - click "Run Code" to test';
            statusElement.className = 'editor-status ready';
        }
    }

    async runPlaygroundCode() {
        const codeEditor = document.getElementById('code-editor');
        const statusElement = document.getElementById('editor-status');

        if (!codeEditor) return;

        try {
            // Extract function from user code
            const userCode = codeEditor.textContent;

            // Simple validation - check if it contains a function
            if (!userCode.includes('function') || !userCode.includes('return')) {
                throw new Error('Code must contain a function that returns the sorted array');
            }

            // Create test function
            const testFunction = new Function('arr', userCode + '\nreturn ' + this.codePlayground.currentAlgorithm + 'Sort(arr);');

            // Run tests
            await this.runPlaygroundTests(testFunction);

            statusElement.textContent = '✅ Code executed successfully!';
            statusElement.className = 'editor-status success';

        } catch (error) {
            statusElement.textContent = '❌ Error: ' + error.message;
            statusElement.className = 'editor-status error';
        }
    }

    async runPlaygroundTests(testFunction) {
        const testCases = [
            { input: [3, 1, 4, 1, 5], expected: [1, 1, 3, 4, 5] },
            { input: [9, 7, 5, 3, 1], expected: [1, 3, 5, 7, 9] },
            { input: [1, 2, 3, 4, 5], expected: [1, 2, 3, 4, 5] }
        ];

        const testStatuses = ['test1-status', 'test2-status', 'test3-status'];

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            const statusElement = document.getElementById(testStatuses[i]);

            try {
                const result = testFunction([...testCase.input]);
                const isCorrect = JSON.stringify(result) === JSON.stringify(testCase.expected);

                if (statusElement) {
                    statusElement.textContent = isCorrect ? '✅ Pass' : '❌ Fail';
                    statusElement.className = `test-status ${isCorrect ? 'pass' : 'fail'}`;
                }

                // Visualize the sorting if correct
                if (isCorrect) {
                    await this.visualizePlaygroundResult(testCase.input, result);
                }

            } catch (error) {
                if (statusElement) {
                    statusElement.textContent = '❌ Error';
                    statusElement.className = 'test-status error';
                }
            }
        }
    }

    async visualizePlaygroundResult(original, sorted) {
        // Simple visualization in playground canvas
        const canvas = document.getElementById('playground-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = canvas.width / sorted.length;
        const maxValue = Math.max(...sorted);

        sorted.forEach((value, index) => {
            const barHeight = (value / maxValue) * (canvas.height - 20);
            const x = index * barWidth;
            const y = canvas.height - barHeight - 10;

            ctx.fillStyle = '#00ff88';
            ctx.fillRect(x, y, barWidth - 2, barHeight);
        });
    }

    showNotification(message) {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-green);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the visualizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.visualizer = new SortingVisualizer();
    window.visualizer.initializeEducationalFeatures();
});
