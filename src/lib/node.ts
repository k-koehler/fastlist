import { Nullable } from './types';

class Node<T> {
  public value: T;
  public next: Nullable<Node<T>>;
  constructor(value: T, next: Nullable<Node<T>> = null) {
    this.value = value;
    this.next = next;
  }
}
export default Node;
