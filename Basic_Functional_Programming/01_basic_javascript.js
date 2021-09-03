// 함수는 일급객체이다.
// 1. 변수에 담을 수 있다.
const add5 = (a) => a + 5;

// 2. 함수의 인자로 함수를 전달할 수 있다.
const add10 = (add, a) => add(a);
console.log(add10(add5, 10));

// 3. 함수의 return 값으로 함수를 return 할 수 있다.
const f1 = () => () => 1;
console.log(f1()); // () => 1
console.log(f1()()); // 1

// 고차 함수
// 1. 함수를 인자로 받아서 실행하는 함수
const apply1 = (f) => f(1);
console.log(apply1(add5)); // 6
console.log(apply1((a) => a - 1)); // 0

// 2. f를 받아, n번 실행하는 함수
const times = (f, n) => {
  let i = -1;
  while (++i < n) {
    f(i);
  }
};

times(console.log, 3);
