
const axios = require ('axios')
const BASE_URL ="http://localhost:3000"
axios.defaults.baseURL = BASE_URL
const {PATHS} = require("./server.js")
const parsers = require("./parsers.js")
const { LOGIN, PASSWORD, PRIVATE_KEY } = require("./consts.js")
test("Info endpoint positive test", async() => {
const response = await axios.get(PATHS.INFO)
expect(response.status).toEqual(200)
expect(response.data).toEqual('author:23618')
})

test("Hello endpoint positive test", async() => {
try {
await axios.get(PATHS.HELLO+"/Anita")
} catch({response}) {
expect (response.status).toEqual(200)
expect (response.data).toEqual("Name is not valid")
}
})

test("Hello endpoint positive test (whitespace)", async() => {
try {
await axios.get(PATHS.HELLO+"/anita  ")
} catch({response}) {
expect (response.status).toEqual(200)
expect (response.data).toEqual("Hello Anita!")
}
})

test("Hello endpoint negative test (name too long)", async() => {
try {
await axios.get(PATHS.HELLO+"/tooooolonggggggggg")
} catch ({response }) {
expect (response.status).toEqual(400)
expect (response.data).toEqual("Name is not valid")
}
})

test("Hello endpoint negative test (used numbers)", async() => {
try {
await axios.get(PATHS.HELLO+"/1234")
} catch ({response}) {
expect (response.status).toEqual(400)
expect (response.data).toEqual("Name is not valid")
}
})

test("Hello endpoint negative test(polish letters used)", async() => {
try {
await axios.get(PATHS.HELLO+"/źćąęń")
} catch ({response}) {
expect (response.status).toEqual(400)
expect (response.data).toEqual("Name is not valid")
}
})

test("Store endpoint positive test(first req)", async () => {
try {
  await axios.post(PATHS.STORE, {headers: { 'input': 'value'}})
} catch ({response}) {
expect(response.data).toEqual({
    "stored_data": [
        "testowa wartość",
    ]
})
}
})

test("Store endpoint positive test(sec req)", async () => {
try {
  await axios.post(PATHS.STORE, {headers: { 'input': 'value'}})
} catch ({response}) {
expect(response.data).toEqual({
    "stored_data": [
        "testowa wartość",
		"testowa wartość"
    ]
})

}
})



test("Parse positive test", async () => {
const data = "value_A:1;value_B:2;value_C:value_D:3,value_E:4;value_F:5;value_G:value_H:6\n"
const result = parsers.parse(data)
expect(result).toEqual({
            value_A: 1,
            value_B: 2,
            value_C: { value_D: 3, value_E: 4 },
            value_F: 5,
            value_G: { value_H: 6 },

	})
})


test("Login endpoint positive test(string!=NULL)", async () => {
const data = { login: "test", password: "12341234" }	
try {
  await axios.post(PATHS.LOGIN, data)
} catch ({response}) {
expect (response.value).to.not.equal(null)
expect (response.status).toEqual(200)
expect (response.data).toEqual("Name is not valid")
}
})

test("Hello endpoint negative test (valid login)", async() => {
const data = { login: "testt", password: "12341234" }
try {
await axios.post(PATHS.LOGIN, data)
} catch ({response }) {
expect (response.status).toEqual(401)
expect (response.data).toEqual("Invalid login data")
}
})

test("Hello endpoint negative test (valid password)", async() => {
const data = { login: "test", password: "123412341" }
try {
await axios.post(PATHS.LOGIN, data)
} catch ({response }) {
expect (response.status).toEqual(401)
expect (response.data).toEqual("Invalid login data")
}
})

test("working token", async () => {
	const jwt = require('jsonwebtoken')
	var token = jwt.sign ( { LOGIN }, PRIVATE_KEY)
	const bearer = "Bearer "+token	
try {
  await axios.get(PATHS.PROFILE, {headers: { 'Authorization': bearer }})
} catch ({response}) {
expect (response.status).toEqual(200)
expect (response.data).toEqual({
    "login": "test"
})
}
})

