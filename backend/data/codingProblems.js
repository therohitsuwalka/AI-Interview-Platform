// Curated coding-round problems.
// Each problem is judged via STDIN -> STDOUT (works uniformly across languages).
// `sampleTestCases` are shown to the candidate (used by "Run").
// `hiddenTestCases` are NOT shown, only used by "Submit" for the final verdict.

export const codingProblems = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Map"],
    statement:
      "Given an array of integers and a target value, return the indices (0-based) of the two numbers that add up to the target, in increasing order, separated by a space. Assume exactly one valid answer exists.",
    constraints: [
      "2 <= array length <= 1000",
      "-10^6 <= array[i] <= 10^6",
      "Exactly one valid pair exists",
    ],
    inputFormat:
      "Line 1: space-separated integers (the array)\nLine 2: the target integer",
    outputFormat: "Two space-separated indices (increasing order)",
    sampleTestCases: [
      { input: "2 7 11 15\n9", output: "0 1" },
      { input: "3 2 4\n6", output: "1 2" },
    ],
    hiddenTestCases: [
      { input: "1 5 3 8\n11", output: "1 3" },
      { input: "-1 -2 -3 -4 -5\n-8", output: "2 4" },
      { input: "0 4 3 0\n0", output: "0 3" },
    ],
    starterCode: {
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const arr = lines[0].trim().split(/\\s+/).map(Number);
const target = parseInt(lines[1].trim());

function twoSum(arr, target) {
  // write your solution here
  return [];
}

const result = twoSum(arr, target);
console.log(result.join(' '));
`,
      python: `import sys

data = sys.stdin.read().split('\\n')
arr = list(map(int, data[0].split()))
target = int(data[1])

def two_sum(arr, target):
    # write your solution here
    return []

result = two_sum(arr, target)
print(' '.join(map(str, result)))
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    vector<int> arr;
    int x;
    string line;
    getline(cin, line);
    stringstream ss(line);
    while (ss >> x) arr.push_back(x);

    int target;
    cin >> target;

    // write your solution here

    cout << "" << endl;
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split("\\\\s+");
        int[] arr = new int[parts.length];
        for (int i = 0; i < parts.length; i++) arr[i] = Integer.parseInt(parts[i]);
        int target = Integer.parseInt(sc.nextLine().trim());

        // write your solution here

        System.out.println("");
    }
}
`,
    },
  },

  {
    id: "reverse-string",
    title: "Reverse a String",
    difficulty: "Easy",
    tags: ["String"],
    statement:
      "Given a single line string, print it reversed.",
    constraints: ["1 <= string length <= 10^5"],
    inputFormat: "Line 1: the string",
    outputFormat: "The reversed string",
    sampleTestCases: [
      { input: "hello", output: "olleh" },
      { input: "AI Interview", output: "weivretnI IA" },
    ],
    hiddenTestCases: [
      { input: "racecar", output: "racecar" },
      { input: "OpenAI", output: "IAnepO" },
      { input: "a", output: "a" },
    ],
    starterCode: {
      javascript: `const line = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n')[0];

function reverseString(str) {
  // write your solution here
  return str;
}

console.log(reverseString(line));
`,
      python: `line = input()

def reverse_string(s):
    # write your solution here
    return s

print(reverse_string(line))
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    getline(cin, s);

    // write your solution here

    cout << s << endl;
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();

        // write your solution here

        System.out.println(s);
    }
}
`,
    },
  },

  {
    id: "fizzbuzz",
    title: "FizzBuzz",
    difficulty: "Easy",
    tags: ["Basics", "Loops"],
    statement:
      "Given an integer n, print numbers from 1 to n, one per line. For multiples of 3 print 'Fizz', for multiples of 5 print 'Buzz', and for multiples of both print 'FizzBuzz'.",
    constraints: ["1 <= n <= 1000"],
    inputFormat: "Line 1: integer n",
    outputFormat: "n lines as described above",
    sampleTestCases: [
      { input: "5", output: "1\n2\nFizz\n4\nBuzz" },
      { input: "15", output: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" },
    ],
    hiddenTestCases: [
      { input: "1", output: "1" },
      { input: "3", output: "1\n2\nFizz" },
    ],
    starterCode: {
      javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());

// write your solution here
`,
      python: `n = int(input())

# write your solution here
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;

    // write your solution here

    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();

        // write your solution here
    }
}
`,
    },
  },
];

export const getProblemSummaries = () =>
  codingProblems.map((p) => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    tags: p.tags,
  }));

export const getProblemPublic = (id) => {
  const problem = codingProblems.find((p) => p.id === id);
  if (!problem) return null;

  // Never leak hidden test cases to the client
  const { hiddenTestCases, ...publicData } = problem;
  return publicData;
};

export const getProblemFull = (id) =>
  codingProblems.find((p) => p.id === id) || null;
