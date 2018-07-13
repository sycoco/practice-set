var Student1 = /** @class */ (function () {
    function Student1(firstName, middleInitial, lastName) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
    return Student1;
}());
// function greeter(person : Person) {
//     return "Hello, " + person.firstName + " " + person.lastName;
// }
var list = [1, 2, 3];
var arr = [1, 34];
// 枚举
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
var c = Color.Green;
