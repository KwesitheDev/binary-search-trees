// Node class
class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

// Tree class
class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildTree(array) {
    // Remove duplicates and sort the array
    const uniqueSortedArray = [...new Set(array)].sort((a, b) => a - b);
    
    const buildBalancedTree = (arr, start, end) => {
      if (start > end) return null;
      
      const mid = Math.floor((start + end) / 2);
      const node = new Node(arr[mid]);
      
      node.left = buildBalancedTree(arr, start, mid - 1);
      node.right = buildBalancedTree(arr, mid + 1, end);
      
      return node;
    };
    
    return buildBalancedTree(uniqueSortedArray, 0, uniqueSortedArray.length - 1);
  }

  insert(value) {
    this.root = this._insertRec(this.root, value);
  }

  _insertRec(root, value) {
    if (root === null) {
      return new Node(value);
    }

    if (value < root.data) {
      root.left = this._insertRec(root.left, value);
    } else if (value > root.data) {
      root.right = this._insertRec(root.right, value);
    }

    return root;
  }

  deleteItem(value) {
    this.root = this._deleteRec(this.root, value);
  }

  _deleteRec(root, value) {
    if (root === null) return root;

    if (value < root.data) {
      root.left = this._deleteRec(root.left, value);
    } else if (value > root.data) {
      root.right = this._deleteRec(root.right, value);
    } else {
      // Node with only one child or no child
      if (root.left === null) {
        return root.right;
      } else if (root.right === null) {
        return root.left;
      }

      // Node with two children
      root.data = this._minValue(root.right);
      root.right = this._deleteRec(root.right, root.data);
    }

    return root;
  }

  _minValue(root) {
    let minv = root.data;
    while (root.left !== null) {
      minv = root.left.data;
      root = root.left;
    }
    return minv;
  }

  find(value) {
    return this._findRec(this.root, value);
  }

  _findRec(root, value) {
    if (root === null || root.data === value) return root;

    if (value < root.data) {
      return this._findRec(root.left, value);
    }

    return this._findRec(root.right, value);
  }

  levelOrder(callback) {
    if (!callback) {
      throw new Error("A callback function is required");
    }

    const queue = [];
    if (this.root) queue.push(this.root);

    while (queue.length > 0) {
      const node = queue.shift();
      callback(node);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  inOrder(callback) {
    if (!callback) {
      throw new Error("A callback function is required");
    }

    const inOrderRec = (node) => {
      if (node === null) return;
      inOrderRec(node.left);
      callback(node);
      inOrderRec(node.right);
    };

    inOrderRec(this.root);
  }

  preOrder(callback) {
    if (!callback) {
      throw new Error("A callback function is required");
    }

    const preOrderRec = (node) => {
      if (node === null) return;
      callback(node);
      preOrderRec(node.left);
      preOrderRec(node.right);
    };

    preOrderRec(this.root);
  }

  postOrder(callback) {
    if (!callback) {
      throw new Error("A callback function is required");
    }

    const postOrderRec = (node) => {
      if (node === null) return;
      postOrderRec(node.left);
      postOrderRec(node.right);
      callback(node);
    };

    postOrderRec(this.root);
  }

  height(node) {
    if (node === null) return -1;
    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);
    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(node) {
    return this._depthRec(this.root, node);
  }

  _depthRec(root, node, depth = 0) {
    if (root === null) return -1;
    if (root === node) return depth;

    const leftDepth = this._depthRec(root.left, node, depth + 1);
    if (leftDepth !== -1) return leftDepth;

    return this._depthRec(root.right, node, depth + 1);
  }

  isBalanced() {
    return this._isBalancedRec(this.root);
  }

  _isBalancedRec(node) {
    if (node === null) return true;

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    if (Math.abs(leftHeight - rightHeight) <= 1 &&
        this._isBalancedRec(node.left) &&
        this._isBalancedRec(node.right)) {
      return true;
    }

    return false;
  }

  rebalance() {
    const nodes = [];
    this.inOrder((node) => nodes.push(node.data));
    this.root = this.buildTree(nodes);
  }
}

// Driver script
function createRandomArray(size, max) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max));
}

function printTree(tree) {
  console.log("Level order:");
  tree.levelOrder((node) => process.stdout.write(node.data + " "));
  console.log("\nPre-order:");
  tree.preOrder((node) => process.stdout.write(node.data + " "));
  console.log("\nPost-order:");
  tree.postOrder((node) => process.stdout.write(node.data + " "));
  console.log("\nIn-order:");
  tree.inOrder((node) => process.stdout.write(node.data + " "));
  console.log("\n");
}

// Create a binary search tree from an array of random numbers < 100
const randomArray = createRandomArray(10, 100);
const bst = new Tree(randomArray);

// Confirm that the tree is balanced
console.log("Is the tree balanced?", bst.isBalanced());

// Print out all elements in level, pre, post, and in order
printTree(bst);

// Unbalance the tree by adding several numbers > 100
bst.insert(100);
bst.insert(500);
bst.insert(200);

// Confirm that the tree is unbalanced
console.log("Is the tree balanced after adding numbers > 100?", bst.isBalanced());

// Balance the tree
bst.rebalance();

// Confirm that the tree is balanced
console.log("Is the tree balanced after rebalancing?", bst.isBalanced());

// Print out all elements in level, pre, post, and in order
printTree(bst);

// Pretty print function (for visualization)
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

// Visualize the final balanced tree
console.log("\nVisualization of the balanced tree:");
prettyPrint(bst.root);