const index = require("./index")
// @ponicode
describe("index", () => {
    test("0", () => {
        let callFunction = () => {
            index("\"[3,\"false\",false]\"")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            index("\"{\"x\":[10,null,null,null]}\"")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            index("\"\"2006-01-02T14:04:05.000Z\"\"")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            index("\"{\"x\":5,\"y\":6}\"")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            index(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
