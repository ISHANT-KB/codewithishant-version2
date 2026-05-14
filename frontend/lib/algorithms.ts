export type AlgorithmCategoryId = "sorting" | "searching";

export interface AlgorithmCategory {
  id: AlgorithmCategoryId;
  label: string;
  description: string;
}

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: AlgorithmCategoryId;
  route: string;
  complexity: string;
  summary: string;
}

export const categories: AlgorithmCategory[] = [
  {
    id: "sorting",
    label: "Sorting Algorithms",
    description: "Reorder data step by step and observe comparisons and swaps.",
  },
  {
    id: "searching",
    label: "Searching Algorithms",
    description: "Find target values by narrowing search space in each step.",
  },
];

export const algorithmRegistry: AlgorithmMeta[] = [
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    category: "sorting",
    route: "/visualizer/sorting/bubble-sort",
    complexity: "O(n^2)",
    summary: "Compares neighbors and swaps until largest values bubble to end.",
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    category: "sorting",
    route: "/visualizer/sorting/merge-sort",
    complexity: "O(n log n)",
    summary: "Divides array recursively and merges sorted halves back together.",
  },
  {
    id: "insertion-sort",
    name: "Insertion Sort",
    category: "sorting",
    route: "/visualizer/sorting/insertion-sort",
    complexity: "O(n^2)",
    summary: "Builds sorted array by inserting each element into correct position.",
  },
  {
    id:"topological-sort",
    name: "Topological Sort",
    category: "sorting",
    route: "/visualizer/sorting/topological-sort",
    complexity: "O(V+E)",
    summary: "Orders DAG vertices so each vertex comes before its outgoing edges.",
  },
  {
    id: "binary-search",
    name: "Binary Search",
    category: "searching",
    route: "/visualizer/searching/binary-search",
    complexity: "O(log n)",
    summary: "Repeatedly checks middle value to cut search range in half.",
  },

];
