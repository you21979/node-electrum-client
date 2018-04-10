import * as assert from 'assert'

export enum PARSE_STATUS{
    DONE,
    SUSPEND,
    ABEND,
}

export interface IParseContext{
    code: PARSE_STATUS
    chunk: string
}

interface IParseOption{
    delimiter: string
    max_depth: number
}

export type chunk_on_complete = (data: string, depth: number) => boolean
export type parser = (chunk: string, callback: chunk_on_complete) => IParseContext

const recursiveParser = (depth: number, chunk: string, callback: chunk_on_complete, option: IParseOption): IParseContext => {
    if(chunk.length === 0) {
        return {code: PARSE_STATUS.DONE, chunk: chunk}
    }
    if(depth >= option.max_depth) {
        return {code: PARSE_STATUS.SUSPEND, chunk: chunk} 
    }
    const chunk_list: Array<string> = chunk.split(option.delimiter)
    if(chunk_list.length === 1){
        return {code: PARSE_STATUS.DONE, chunk: chunk}
    }
    assert(chunk_list.length !== 0)
    const complete_data: string = chunk_list[0]
    const next_chunk_list: string = chunk_list.slice(1).join(option.delimiter)
    const result: boolean = callback(complete_data, depth)
    if(!result){
        return {code: PARSE_STATUS.ABEND, chunk: chunk}
    }
    return recursiveParser(depth + 1, next_chunk_list, callback, option)
}

export const createRecursiveParser = (delimiter: string, max_depth: number = 10): parser => {
    assert(max_depth > 0)
    return (chunk: string, callback: chunk_on_complete): IParseContext => recursiveParser(0, chunk, callback, { delimiter, max_depth })
}

