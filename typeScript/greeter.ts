
class Student {
    fullName: string;
    constructor(public firstName, public middleInitial, public lastName) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}
interface Person {
    firstName: string;
    lastName: string;
}

// function greeter(person : Person) {
//     return "Hello, " + person.firstName + " " + person.lastName;
// }



let list: Array<number> = [1, 2, 3];
let arr: number[] =[1,34];


// 枚举
enum Color {Red, Green, Blue}
let c: Color = Color.Green;