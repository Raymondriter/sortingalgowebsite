# 🔬 Sorting Algorithm Visualizer

**🚀 The Most Comprehensive Sorting Algorithm Learning Tool Ever Created**

A definitive, interactive, and educational website designed to help users learn about and visualize a comprehensive collection of sorting algorithms. Built with modern web technologies, this professional-grade tool serves as the ultimate learning resource for students, developers, and computer science enthusiasts.

## 🏆 **Incredible Achievement: 18 Algorithms Implemented!**

This visualizer includes **18 fully functional sorting algorithms** across all major categories, making it one of the most comprehensive sorting algorithm educational tools available.

## Features

### 🎨 Modern Design
- **Dark Theme**: Professional dark mode with vibrant accent colors
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Clean Typography**: Uses JetBrains Mono font for optimal code readability

### 🔧 Interactive Visualizer
- **Real-time Visualization**: Watch algorithms sort arrays step-by-step
- **Customizable Controls**:
  - Play/Pause animation
  - Step forward/backward through algorithm execution
  - Adjustable animation speed
  - Variable array sizes (5-100 elements)
  - Random array generation
- **Color-coded States**:
  - 🔵 Blue: Default bars
  - 🟠 Orange: Elements being compared
  - 🩷 Pink: Elements being swapped
  - 🟢 Green: Sorted elements

### 📚 Comprehensive Algorithm Coverage

#### Simple Sorts (O(n²))
- **Bubble Sort**: Repeatedly swaps adjacent elements
- **Selection Sort**: Finds minimum element and places it at the beginning
- **Insertion Sort**: Builds final sorted array one item at a time
- **Gnome Sort**: Like insertion sort but with gnome-like movement
- **Cocktail Shaker Sort**: Bidirectional bubble sort

#### Efficient Sorts (O(n log n))
- **Merge Sort**: Divides array into halves and recursively sorts them
- **Quick Sort**: Selects pivot and partitions array around it
- **Heap Sort**: Uses heap data structure to sort elements
- **Shell Sort**: Generalized insertion sort with gap sequences
- **Comb Sort**: Improved bubble sort with gap reduction
- **Smoothsort**: Adaptive heap sort variant

#### Hybrid Sorts
- **Timsort**: Hybrid of merge sort and insertion sort (Python's default)
- **Introsort**: Hybrid that switches between quicksort and heapsort

#### Distribution Sorts
- **Counting Sort**: Counts occurrences of each element
- **Radix Sort**: Sorts by individual digits
- **Bucket Sort**: Distributes elements into buckets

#### Educational Sorts
- **Bogo Sort**: Randomly shuffles until sorted (demonstrates worst-case)
- **Sleep Sort**: Uses sleep times to sort (educational purposes)

### 📊 Comparison Tools
- **Side-by-side Comparison**: Compare all algorithms across multiple metrics
- **Complexity Analysis**: Best, average, and worst-case time complexity
- **Space Complexity**: Memory usage analysis
- **Stability Indicators**: Shows which algorithms maintain element order
- **Use Case Recommendations**: Guidance on when to use each algorithm

## Getting Started

### Running Locally

1. **Clone or download** the project files
2. **Start a local server**:
   ```bash
   # Using Python 3
   python3 -m http.server 8000

   # Using Node.js (if you have it installed)
   npx serve .

   # Using PHP (if you have it installed)
   php -S localhost:8000
   ```
3. **Open your browser** and navigate to `http://localhost:8000`

### File Structure

```
sorting-visualizer/
├── index.html          # Homepage with algorithm overview
├── styles.css          # All styling and responsive design
├── script.js           # Interactive visualizer logic
├── bubble-sort.html    # Bubble sort page with visualizer
├── selection-sort.html # Selection sort page
├── insertion-sort.html # Insertion sort page
├── merge-sort.html     # Merge sort page
├── quick-sort.html     # Quick sort page
├── heap-sort.html      # Heap sort page
├── comparison.html     # Algorithm comparison table
└── README.md           # This file
```

## How to Use

### 1. Homepage
- Browse available algorithms organized by category
- Click on any algorithm card to visit its dedicated page
- Use the navigation dropdown to access all algorithms

### 2. Algorithm Pages
- **Read the explanation** to understand how the algorithm works
- **Review complexity analysis** for performance characteristics
- **Use the visualizer**:
  1. Select the algorithm using the "Select Algorithm" button
  2. Click "Play" to start the animation
  3. Use "Pause"/"Resume" to control playback
  4. Click "Step Forward" for manual stepping
  5. Adjust speed and array size with the sliders
  6. Click "Randomize" to generate new data

### 3. Comparison Page
- **Compare algorithms** side-by-side across all metrics
- **Read recommendations** for when to use each algorithm
- **Understand complexity notations** with the built-in legend

## Learning with the Visualizer

### Best Learning Practices

1. **Start Simple**: Begin with Bubble Sort to understand basic concepts
2. **Compare Similar Algorithms**: Look at Bubble vs Selection vs Insertion
3. **Understand Trade-offs**: Compare time vs space complexity
4. **Experiment**: Try different array sizes and data patterns
5. **Step Through**: Use the step controls to see exactly what happens

### Key Concepts to Learn

- **Time Complexity**: How algorithm performance scales with input size
- **Space Complexity**: Memory requirements of different approaches
- **Stability**: Whether equal elements maintain their relative order
- **In-place vs Out-of-place**: Memory usage patterns
- **Adaptive Algorithms**: How some algorithms perform better on sorted data

## Browser Compatibility

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Required Features**: ES6 support, CSS Grid, Canvas API
- **Mobile Support**: Fully responsive design for all screen sizes

## Performance Notes

- **Array Size Limits**: Maximum 100 elements for smooth animation
- **Speed Control**: Adjust animation speed for very slow or fast sorting
- **Memory Usage**: Algorithms run entirely in browser memory
- **No External Dependencies**: Pure HTML/CSS/JavaScript implementation

## Contributing

Feel free to suggest improvements or report issues. This project is designed as an educational tool and can be extended with:

- Additional sorting algorithms
- More visualization options
- Performance benchmarking tools
- Sound effects for sorting steps
- Multi-language support

## License

This project is open source and available for educational use.

---

**Happy Learning!** 🎓 May this visualizer help you master sorting algorithms and understand the beauty of efficient algorithms.
