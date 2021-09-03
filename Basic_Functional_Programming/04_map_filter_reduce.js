const products = [
  { name: '반팔티', price: 15000 },
  { name: '긴팔티', price: 20000 },
  { name: '핸드폰케이스', price: 15000 },
  { name: '후드티', price: 30000 },
  { name: '바지', price: 25000 }
]

// 1. map
// iter : map 함수가 받는 인자는 iterable이다.
// 추상화 : f 함수를 받아 어떤 처리를 할지 f에 온전히 위임한다.
const map = (f, iter) => {
  let res = []
  for (const i of iter) res.push(f(i))
  return res
}

console.log(map((a) => a.name, products))

// 2. iterable protocol에 따른 map의 다형성 1
const nodes = document.querySelectorAll('*') // NodeList

// map은 iterable 객체를 모두 수용하기 때문에 Array, String, NodeList, Set 모두 수용한다.
// 이와 같은 map의 특성을 다형성이 높다라고 한다.

// 3. iterable protocol에 따른 map의 다형성 2
// map 함수를 활용해 Map 객체를 활용한 새로운 Map 객체 생성
// 여기서 다형성은 map함수를 적용시켰을 때, 원본 데이터 형식을 그대로 유지할 수 있다는 점
let m = new Map()

m.set('a', 10)
m.set('b', 20)

console.log(new Map(map(([k, a]) => [k, a * 2], m)))

console.clear()
// 4. filter
const filter = (f, iter) => {
  const res = []
  for (const i of iter) {
    if (f(i)) res.push(i)
  }
  return res
}

console.log(filter((a) => a.price > 15000, products))
// filter의 결과물은 iterable, 따라서 다른 iterable을 받을 수 있다.
console.log(
  filter(
    (n) => n % 2,
    (function* () {
      yield 1
      yield 2
      yield 4
      yield 6
      yield 12
      yield 16
      yield 19
    })()
  )
)

// 5. reduce
const nums = [1, 2, 3, 4, 5]

const reduce = (f, acc, iter) => {
  if (!iter) {
    // acc의 iterator를 추출 -> 초기값이 없으므로 acc을 iter로 봄.
    iter = acc[Symbol.iterator]() // iter를 새롭게 정의
    acc = iter.next().value // 초기값 추출
  }
  for (const a of iter) {
    acc = f(acc, a)
  }
  return acc
}

const add = (a, b) => a + b

// reduce가 없는 경우
console.log(add(add(add(0, 1), 2), 3))
// reduce 사용
console.log(reduce(add, 0, [1, 2, 3]))
console.log(reduce(add, [1, 2, 3]))

// 6. reduce 2
console.clear()

// reduce의 첫 인자인 f 함수를 사용자가 임의로 설정할 수 있다 -> 다형성이 높다.
console.log(
  reduce((total_price, product) => total_price + product.price, 0, products)
)

// 7. map + filter + reduce 중첩 사용, 함수형 사고

// 20000 미만의 합산 가격
console.log(
  reduce(
    (total_price, price) => total_price + price,
    0,
    filter(
      (e) => e < 20000,
      map((e) => e.price, products)
    )
  )
)

console.log(
  reduce(
    (total_price, price) => total_price + price,
    0,
    map(
      (e) => e.price,
      filter((e) => e.price < 20000, products)
    )
  )
)

console.clear()

export { add, map, filter, reduce, products }
