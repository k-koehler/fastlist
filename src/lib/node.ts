import { Nullable } from './types';

const NODE_POOL_SIZE = 1000;

// TODO make this faster
function* nodePoolAllocator<T>(): Generator<Node<T>> {
  let nodePool = new Array(NODE_POOL_SIZE);
  let i = 0;
  while (true) {
    for (; i < NODE_POOL_SIZE; ++i) {
      nodePool[i] = new Node(null);
      yield nodePool[i];
    }
    nodePool = new Array(NODE_POOL_SIZE);
  }
}

const nodeAllocator = nodePoolAllocator();

class Node<T> {
  /**
   * allocate a new node
   * nodes should be stored in contiguous memory
   * addrs reducing cache misses
   */
  public static alloc<T = any>(
    value: T = null,
    next: Nullable<Node<T>> = null
  ): Node<T> {
    const node = nodeAllocator.next().value;
    node.value = value;
    node.next = next;
    return node;
  }
  public value: Nullable<T>;
  public next: Nullable<Node<T>>;
  constructor(value: Nullable<T>, next: Nullable<Node<T>> = null) {
    this.value = value;
    this.next = next;
  }
}
export default Node;
