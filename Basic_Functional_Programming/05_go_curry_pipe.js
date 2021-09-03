import { add, map, filter, reduce, products } from './04_map_filter_reduce.js'

// 목적: 함수의 중첩을 더 읽기 쉽게 만들어보자.

// 타겟: add(add(add(add(1, 2), 3), 4), 5) -> ???

// 1. go, pipe

// go: 여러 함수 호출을 인자로 받아서 처리하는 함수
const go = (...args) => reduce((v, f) => f(v), args)

// pipe:
// (f, ...fs): 첫번째 함수 f와 나머지 ...fs를 받고,
// (...as): 어떤 인자를 받아서
// go(f(...as), ...fs): 첫 인자는 f 함수를 호출한 값,
//                      그리고 나머지 함수를 연속해서 실행하도록 go 함수 사용
// 그러니까 pipe 함수는 초기값을 설정할 때 사용하는거다.
const pipe =
  (f, ...fs) =>
  (...as) =>
    go(f(...as), ...fs)

go(
  add(0, 1),
  (v) => v + 1,
  (v) => v + 10,
  (v) => v + 100,
  console.log
)

const f = pipe(
  (a, b) => a + b,
  (v) => v + 10,
  (v) => v + 100,
  console.log
)

// f = (...as) => go(f(...as), [v => v + 10, v => v + 100])

// 2. go 를 이용하여 읽기 좋은 코드로 만들기
// 변경 전
console.log(
  reduce(
    (acc, cur) => acc + cur,
    filter(
      (n) => n < 20000,
      map((p) => p.price, products)
    )
  )
)

// 변경 후, 중첩된 함수 호출이 인자를 받는 것으로 좀 더 깔끔하게 변경됨.
go(
  products,
  (items) => map((p) => p.price, items),
  (items) => filter((n) => n < 20000, items),
  (prices) => reduce((a, b) => a + b, prices),
  console.log
)

// 3. go + curry를 사용하여 더 읽기 좋은 코드로 만들기

// curry : 함수를 입력받고, 다른 함수를 return.
// 다른 함수는 인자가 2개 이상 or 2개 미만 조건에 따라 결과 호출(true) or 새로운 함수 반환(false)
const curry =
  (f) =>
  (a, ..._) =>
    _.length ? f(a, ..._) : (..._) => f(a, ..._)

const mult = curry((a, b) => a * b)
console.log(mult(1, 3, 2)) // 남은 인자는 활용하지 않는다.

const mult3 = mult(3)
console.log(mult3) // (..._) => f(3, ..._)
console.log(mult3(2)) // f(3, 2) -> 3 * 2 = 6

const _map = curry(map) // (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._)
const _filter = curry(filter)
const _reduce = curry(reduce)

console.clear()
// 3-1. 변경 전
go(
  products,
  (items) => _map((p) => p.price, items),
  (items) => _filter((n) => n < 20000, items),
  (prices) => _reduce((a, b) => a + b, prices),
  console.log
)

// 1차 변경
go(
  products,
  (items) => _map((p) => p.price)(items), // 호출한 값을 return
  (items) => _filter((n) => n < 20000)(items),
  (prices) => _reduce((a, b) => a + b)(prices),
  console.log
)

// 2차 변경: reduce에서 acc = f(acc, a) 이다. 여기서 a는 _filter와 같은 함수이고,
// f = (v, fn) => fn(v)이므로, acc 인자가 앞에서부터 차례대로 들어간다.
// 따라서 생략해도 괜찮다. 생략하면 curry 함수에 의해 ..._ 에 해당 인자가 들어간다.
console.log('done')
go(
  products,
  _filter((p) => p.price < 20000),
  _map((p) => p.price),
  _reduce(add),
  console.log
)

// 4. 함수 조합으로 함수 만들기

// 4-1. go 함수의 filter 조건만 다른 경우, 코드 중복이 많다.

// 변경 전
go(
  products,
  _filter((p) => p.price < 20000), // 이하
  _map((p) => p.price),
  _reduce(add),
  console.log
)

go(
  products,
  _filter((p) => p.price >= 20000), // 이상
  _map((p) => p.price),
  _reduce(add),
  console.log
)

// 4-2. pipe 함수로 해결.
const total_price = pipe(
  _map((p) => p.price),
  _reduce(add)
) // 합을 구하는 나머지 로직을 작성하고,

const base_total_price = (predi) => pipe(_filter(predi), total_price) // filter 조건에 따라 데이터 추출.

// 변경 후, 훨씬 줄어듦.

go(
  products,
  base_total_price((p) => p.price < 20000),
  console.log
)

go(
  products,
  base_total_price((p) => p.price > 20000),
  console.log
)
