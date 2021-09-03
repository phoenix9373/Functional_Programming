// 리스트 순회
// 1. es5
const arr = [1, 2, 3, 4];
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// 2. es6
const str = "abcde";
for (const i of str) {
  console.log(i);
}

console.clear();

// Iterable/iterator 프로토콜 - Array, Set, Map
// Array
const arr2 = [1, 2, 3, 4];
for (const i of arr2[Symbol.iterator]()) console.log(i);

// Set
const set = new Set([1, 2, 3]);
for (const i of set[Symbol.iterator]()) console.log(i);

// Map
const map = new Map([
  ["a", 1],
  ["b", 2],
  ["c", 3],
]);
for (const a of map.keys()[Symbol.iterator]()) console.log(a);
for (const a of map.values()[Symbol.iterator]()) console.log(a);

console.clear();

// Iterator => next() 실행마다 {value: , done: } 반환.
const iter = arr2[Symbol.iterator]();
console.log(iter.next()); // 1, false
console.log(iter.next()); // 2, false
console.log(iter.next()); // 3, false
console.log(iter.next()); // 4, false
console.log(iter.next()); // undefined, true => iterator 종료
console.log(iter.next()); // 동일

// 앞에서 모두 소진했으므로 출력 없음.
for (const i of iter) console.log(i);

// for-of 에서 {value: i, done: false}를 받으며 value를 출력, done: true이면 끝

// 정의
// iterable : iterator를 return 하는 [Symbol.iterator] 프로퍼티를 가진 객체
// iterator : 객체를 return 하는 next() 메서드를 가진 값.
// iterator / iterable protocol : iterable 객체를 for ... of 문, 전개연산자와 같이 동작하도록 한 규약

// 사용자 정의 이터러블
// 직접 iterator 객체를 반환하는 iterable 객체를 생성
// 내부에서 [Symbol.iterator]를 메서드로 정의, 또한 반환하는 객체에서도 [Symbol.iterator]를 반환.
const iterable = {
  [Symbol.iterator]() {
    // 1. [Symbol.iterator] 정의
    let i = 3;
    return {
      // 2. next
      next() {
        return i === 0 ? { done: true } : { value: i--, done: false };
      },
      [Symbol.iterator]() {
        // [Symbol.iterator] 메서드를 반환하지 않으면 iterable 동작에서 error가 발생한다.
        return this; // 여기서 this는 가장 상위 객체인 iterator가 된다.
      },
    };
  },
};

console.clear();

const iterator = iterable[Symbol.iterator]();

for (const i of iterable) console.log(i);
for (const i of iterator) console.log(i);

// ...(전개연산자) 도 iterable 객체를 전개하는 연산자이다.
