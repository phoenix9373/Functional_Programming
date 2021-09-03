// 제너레이터 : 이터레이터이자 동시에 이터러블을 생성하는 함수
// 1. Generator 결과는 Iterator
// 2. Generator는 well-formed iterator(자기 자신을 반환하는 iterator)

function* gen() {
  yield 1;
  yield 2;
  yield 3;
  return 100;
}

let iter = gen(); // generator 객체: well-formed iterable
console.log(iter[Symbol.iterator]() === iter); // true

// well-formed와 non-well-formed의 차이
// -> 이터러블이 진행된 지점을 기억하지 못해 처음부터 restart
// Array, String, Set, NodeList는 모두 [Symbol.iterator]를 내장메서드로 가진다.

// non-well-formed 예시: return문에 [Symbol.iterator]를 포함하지 않음.
var fibonacci = {
  [Symbol.iterator]() {
    let [prev, curr] = [0, 1];
    let step = 0;
    const maxStep = 5;
    return {
      next() {
        [prev, curr] = [curr, prev + curr];
        return { value: curr, done: step++ >= maxStep };
      },
    };
  },
};

for (const v of fibonacci) {
  console.log(v);
  break;
}
// 1

for (const v of fibonacci) {
  console.log(v);
} // 1 2 3 5 8 (1을 포함해서 다시 시작, well-formed의 경우 2부터 다시 시작.)

// 제너레이터로 홀수만 순회하는 Iterator 만들기

// 1. 무한으로 숫자를 만들어내는 Generator
function* infinity(i = 0) {
  while (true) yield i++; // 실제 순회하는 데까지만 값을 만들기 때문에 에러가 나지 않음.
}

// 2. iterator에 대해 limit을 걸어주는 Generator
function* limit(n, iter) {
  for (const a of iter) {
    yield a;
    if (a === n) return;
  }
}

// 3. n에 대해 홀수 값만 yield
function* odds(n) {
  for (const a of limit(n, infinity(1))) {
    if (a % 2) yield a;
    if (a === n) return;
  }
}

let iter2 = odds(10);
console.log(iter2.next());
console.log(iter2.next());
console.log(iter2.next());
console.log(iter2.next());
console.log(iter2.next());
console.log(iter2.next());

// odds Iterator 활용
console.clear();

// 1. 전개 연산자
console.log(...odds(10));
console.log([...odds(10), ...odds(20)]);

// 2. 구조 분해, 나머지 연산자
const [head, ...tail] = odds(10);
console.log(head);
console.log(tail);
