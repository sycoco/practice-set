# TypeScript 小技巧

### 安装

安装最新开发版

```sh
npm install -g typescript@next
```

安装正式版

```sh
npm i -g typescript
```

### 什么是 TypeScript

- Provide an optional type system for JavaScript.

- Provide planned features from future JavaScript editions to current JavaScript engines

### 谁在用 TypeScript

国外：微软、谷歌、Netflix

国内：Antd

### 基础类型

https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/Basic%20Types.md

#### Boolean

```typescript
let isDone: boolean = false;
```

#### Number

```typescript
let decimal: number = 6;
let binary: number = 0b1010;
let arr = 111_111
```

#### String

```typescript
let color: string = "blue";
color = 'red';
```

Elixir 中对双引号和单引号的解释。

#### Array

```typescript
let list: number[] = [1, 2, 3];
let users: User[] = [];
let arr: Array<number | string> = [];
let arr: Array<{[key: string]: any}> = [];
```

#### Tuple

Tuple types allow you to express an array where the type of a fixed number of elements is known.

Tuple允许你描述数组的某个位置的类型。

```typescript
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ["hello", 10]; // OK
// Initialize it incorrectly
x = [10, "hello"]; // Errorpublic orgs: [IOrg]
```

```typescript
export class User {
  /** 用户所属组织，数组只能有一个对象 */
  public orgs: [IOrg]
}

const user = new User()

user.orgs = [Org, Org]; // Error: 属性类型 length 不兼容，不能将类型2分配给类型1
```

#### Enum

```typescript
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2];
```

```javascript
var Color;
(function (Color) {
    Color[Color["Red"] = 1] = "Red";
    Color[Color["Green"] = 2] = "Green";
    Color[Color["Blue"] = 3] = "Blue";
})(Color || (Color = {}));
var colorName = Color[2];
```

```typescript
enum Action {ADD, UPDATE, DELETE}
case Action[ADD]:
```

#### Any

```typescript
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```

#### Void

```typescript
function warnUser(): void {
    console.log("This is my warning message");
}

// void 还有 undefined 的意思
let unusable: void = undefined;
```

#### Null and Undefined

不严格的情况下，任何类型都可以是 Null 和 Undefined 类型。`strictNullCheck: "true"` 

```typescript
let foo = 1
foo = null
```

#### Never

The`never`type represents the type of values that never occur. For instance,`never`is the return type for a function expression or an arrow function expression that always throws an exception or one that never returns;

```typescript
function error(message: string): never {
    throw new Error(message);
}
```

#### Object

`object`is a type that represents the non-primitive type, i.e. any thing that is not`number`,`string`,`boolean`,`symbol`,`null`, or`undefined`.

```typescript
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error

declare function create(o: Object | null): void;
create(42); //Okay
```

#### 结构类型

```typescript
interface Named {
    name: string;
}

let x: Named;
// y's inferred type is { name: string; location: string; }
let y = { name: "Alice", location: "Seattle" };
x = y;
```

#### function

函数的类型由2部分组成：参数列表，返回值

```typescript
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // OK
x = y; // Error
```

#### Optional Parameters and Rest Parameters

可选参数要写在后面

```typescript
function create(a: number, d?: any) {}
```

```typescript
function invokeLater(args: any[], callback: (...args: any[]) => void) {
    /* ... Invoke callback with 'args' ... */

}
// 也可以给 any 声明类型，前提是你知道类型
function invokeLater(args: number[], callback: (...args: number[]) => void) {
    /* ... Invoke callback with 'args' ... */

}
invokeLater([1, 2], (x, y) => console.log(x + ", " + y));
```

#### class

class 是 object literal types 的同时也是 interface。但是比较两个 class 的类型时，不比较 constructor 和静态属性。

```typescript
class Animal {
    feet: number;
    constructor(name: string, numFeet: number) { }
}

class Size {
    feet: number;
    constructor(numFeet: number) { }
}

let a: Animal;
let s: Size;

a = s;  // OK
s = a;  // OK
```

如何声明一个 class 类型

```typescript
function create(user: new() => User): void
```

#### Generics

泛型也叫类型的参数。由于是结构类型，类型的参数只影响结果。

```typescript
interface Empty<T> {
}
let x: Empty<number>;
let y: Empty<string>;

x = y;  // OK, because y matches structure of x

interface NotEmpty<T> {
    data: T;
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;

x = y;  // Error, because x and y are not compatible
```

```typescript
type Response<T> {
   status: "success" | "failure"
     results: T[]
}
type User = {}
declare functioin getById(id: number): Observable<Response<User>>
```

### Literal Types

Literals are exact values that are Javascript primitives.

```typescript
let foo: 'Hello';
foo = 'Bar'; // Error: "Bar" is not assignable to type "Hello"
```

```typescript
class User {
  type: "a" | "b" | "c"
}
```

### 小技巧

#### Type Assertions

```typescript
let target: HTMLElement
(<HTMLInputElement>target).value
(target as HTMLInputElement).value

function onClick(event: MouseEvent) {
  cosnt target : EventTarget = event.target
  (event.target as HTMLInputElement).value
}
// https://stackoverflow.com/questions/28900077/why-is-event-target-not-element-in-typescript
```

#### Bang operator

```typescript
type Parameter {
  a: number
  b?: string
}
function create(args: Parameter) {
  console.log(args.b!)
}
```

#### Partial

```typescript
export type InternalStateType = {
  user: AppUser
  token?: IOauth
  permissions: Permission[]
}

  function setState(state: Partial<InternalStateType>) {
    this.state = { ...this.state, ...state }
    this.state$.next(this.state)
  }
```

#### 可选属性

```typescript
class User {
  id?: number
}
```

#### typeof

```typescript
class User { 
    id: number
}

const u = new User

let user: typeof u
```

#### keyof

```typescript
function set(prop: keyof InternalStateType, value: any) {
  this.state[prop] = value
  this.state$.next(this.state)
  return value
}
```

### 项目中的一些问题

#### 需要给什么对象建类型，用什么类型

一般要给业务模型建全局的类型，一般要用 Interface，比较正式，然后写实现继承它

```typescript
interface IUser {
  name: string
}
class UserImpl implements IUser {

}
```

临时的参数用 type 关键字

```typescript
type Parameter {
  page: number
  offset: number
}

function query(args: Parameter) {}
```

#### 属性初始化

```typescript
class User {
  name: string
  fans: User[]
}

class User {
  name = ""
  fans: User[] = []
}
```

#### 什么时候需要写类型，什么时候自动推导

编译器推导不出的情况下需要声明类型

```typescript
orgs = []
orgs: any[] = []
orgs: Org[] = []
```

#### 为什么项目中有 public protected private

更正式，更规范。一般属性写在前面，函数写在下面，constructor 写在中间。

页面需要访问的方法和属性都用 public， 声明周期用protected，一些私有的工具函数或变量或者 service 可以用private。

### 最后

类型写不好，一般说明思路不清晰。

https://github.com/Microsoft/TypeScript-Handbook
