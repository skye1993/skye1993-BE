
const createLookObj = require('../db/seeds/utils-seed.js')

describe("createLookObj", () => {
test("return an object when passed an empty array", () => {
    expect(createLookObj([])).toEqual({})
})
test("return an object with a single key:value pair, when passing the array", () => {
const arrPerson = [{name: "Oscar", activity: "Tennis"}]
const expected = { "Oscar":"Tennis" }
const output = createLookObj(arrPerson, "name", "activity")
expect(output).toEqual(expected)
})
test("return an object with multiple key:value pairs, when passig an array with multiple objects", () => {
const arrPeople = [{name: "Oscar", activity: "Tennis", age: 32},{name: "Amy", activity: "Badminton", age: 32},{name: "Ian", activity: "Weight Lifting", age: 34}
]
const expected = {"Oscar":"Tennis","Amy":"Badminton","Ian":"Weight Lifting"}
const output = createLookObj(arrPeople, "name", "activity")
expect(output).toEqual(expected)
})
test("return objects unmutalated, when passing the array", () => {
 const arrPeople = [{name: "Oscar", activity: "Tennis", age: 32},{name: "Amy", activity: "Badminton", age: 32},{name: "Ian", activity: "Weight Lifting", age: 34}
]
const copyArrPeople = [...arrPeople]
const expected = [{name: "Oscar", activity: "Tennis", age: 32},{name: "Amy", activity: "Badminton", age: 32},{name: "Ian", activity: "Weight Lifting", age: 34}]
expect(copyArrPeople).toEqual(expected)
})
})