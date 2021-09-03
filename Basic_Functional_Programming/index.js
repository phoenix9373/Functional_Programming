const log = console.log

const products = [
  { name: '반팔티', price: 15000, quantity: 1 },
  { name: '긴팔티', price: 20000, quantity: 2 },
  { name: '핸드폰케이스', price: 15000, quantity: 3 },
  { name: '후드티', price: 30000, quantity: 4 },
  { name: '바지', price: 25000, quantity: 5 }
]

const add = (a, b) => a + b

const go = (...args) => reduce((acc, f) => f(acc), args)

const pipe = () => {}

const curry =
  (f) =>
  (
    fn,
    ..._ // 나머지 인자.
  ) =>
    _.length ? f(fn, ..._) : (..._) => f(fn, ..._) // ..._로 여러개의 인자를 받고, 여러개의 인자로 전달.

// f, iter를 받아서 변환된 iter 반환
const map = curry((f, iter) => {
  const res = []
  for (const i of iter) res.push(f(i))
  return res
})

const filter = curry((f, iter) => {
  const res = []
  for (const i of iter) if (f(i)) res.push(i)
  return res
})

const reduce = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]()
    acc = iter.next().value
  }
  for (const i of iter) acc = f(acc, i)
  return acc
})

// 1. 총 수량

// 1-1. 직접 해보기
log(map((p) => p.quantity, products))
log(
  reduce(
    add,
    filter(
      (q) => q > 2,
      map((p) => p.quantity, products)
    )
  )
)

go(
  products,
  map((p) => p.quantity), // 여기에 들어가는 products 인자는 acc로 보면됨.
  filter((q) => q > 2),
  reduce((a, b) => a + b),
  console.log
)

const sum = curry((f, iter) => go(iter, map(f), reduce(add)))

// 총 수량
const total_quantity = sum((p) => p.quantity)

log(total_quantity(products))

// 2. 총 가격

const total_price = sum((p) => p.price * p.quantity)

log(total_price(products))

// 3. 추상화 - 다른 형식의 데이터에도 접근 가능.
log(sum((u) => u.age, [{ age: 1 }, { age: 3 }, { age: 2 }]))
