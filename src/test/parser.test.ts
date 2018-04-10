import * as assert from 'assert'
import {createRecursiveParser,PARSE_STATUS} from '../lib/parser'

type callback = (Error?) => void

describe('parser success', () => {
    it('complete chunk done', () => {
        let max = -1
        let count = 0
        const chunk = "aaaaa\n"
        const check_pattern = ['aaaaa']
        const f = createRecursiveParser('\n')
        const result = f(chunk, (data, depth) => {
            assert(data === check_pattern[depth])
            max = depth
            ++count
            return true
        })
        assert(result.code === PARSE_STATUS.DONE)
        assert(result.chunk === '')
        assert(max === 0)
        assert(count === 1)
    })
    it('complete chunks done', () => {
        let max = -1
        let count = 0
        const chunk = "aaaaa\nbb\nccccccccc\ndddddddddd\neeeeee\n"
        const check_pattern = ['aaaaa', 'bb', 'ccccccccc', 'dddddddddd', 'eeeeee']
        const f = createRecursiveParser('\n', 5)
        const result = f(chunk, (data, depth) => {
            assert(data === check_pattern[depth])
            max = depth
            ++count
            return true
        })
        assert(result.code === PARSE_STATUS.DONE)
        assert(result.chunk === '')
        assert(max === 4)
        assert(count === 5)
    })
    it('complete chunks suspend', () => {
        let max = -1 
        let count = 0
        const chunk = "aaaaa\nbb\nccccccccc\ndddddddddd\neeeeee\n"
        const check_pattern = ['aaaaa', 'bb', 'ccccccccc', 'dddddddddd', 'eeeeee']
        const f = createRecursiveParser('\n', 4)
        const result = f(chunk, (data, depth) => {
            assert(data === check_pattern[depth])
            max = depth
            ++count
            return true
        })
        assert(result.code === PARSE_STATUS.SUSPEND)
        assert(result.chunk === 'eeeeee\n')
        assert(max === 3)
        assert(count === 4)
    })
    it('incomplete chunk done', () => {
        let max = -1 
        let count = 0
        const chunk = "aaaaa"
        const check_pattern = ['aaaaa']
        const f = createRecursiveParser('\n')
        const result = f(chunk, (data, depth) => {
            assert(0)
            assert(data === check_pattern[depth])
            max = depth
            ++count
            return true
        })
        assert(result.code === PARSE_STATUS.DONE)
        assert(result.chunk === 'aaaaa')
        assert(max === -1)
        assert(count === 0)
    })
    it('complete and incomplete chunk done', () => {
        let max = -1 
        let count = 0
        const chunk = "aaaaa\nbb"
        const check_pattern = ['aaaaa', 'bb']
        const f = createRecursiveParser('\n')
        const result = f(chunk, (data, depth) => {
            assert(data === check_pattern[depth])
            max = depth
            ++count
            return true
        })
        assert(result.code === PARSE_STATUS.DONE)
        assert(result.chunk === 'bb')
        assert(max === 0)
        assert(count === 1)
    })
    it('complete and incomplete chunks done', () => {
        let max = -1
        let count = 0
        const chunk = "aaaaa\nbb\nccccccccc\ndddddddddd\neeeeee"
        const check_pattern = ['aaaaa', 'bb', 'ccccccccc', 'dddddddddd', 'eeeeee']
        const f = createRecursiveParser('\n', 5)
        const result = f(chunk, (data, depth) => {
            assert(data === check_pattern[depth])
            max = depth
            ++count
            return true
        })
        assert(result.code === PARSE_STATUS.DONE)
        assert(result.chunk === 'eeeeee')
        assert(max === 3)
        assert(count === 4)
    })
    it('complete and incomplete chunks suspend', () => {
        let max = -1 
        let count = 0
        const chunk = "aaaaa\nbb\nccccccccc\ndddddddddd\neeeeee"
        const check_pattern = ['aaaaa', 'bb', 'ccccccccc', 'dddddddddd', 'eeeeee']
        const f = createRecursiveParser('\n', 3)
        const result = f(chunk, (data, depth) => {
            assert(data === check_pattern[depth])
            max = depth
            ++count
            return true
        })
        assert(result.code === PARSE_STATUS.SUSPEND)
        assert(result.chunk === 'dddddddddd\neeeeee')
        assert(max === 2)
        assert(count === 3)
    })
})
describe('parser error', () => {
    it('error zero depth', () => {
        try{
            const f = createRecursiveParser('\n', 0)
        }catch(e){
            return
        }
        assert(0)
    })
})
