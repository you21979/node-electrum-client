import {IParseContext, PARSE_STATUS, chunk_on_complete, createRecursiveParser} from './parser'

const lineParser = createRecursiveParser('\n', 20)

export class JsonMessageParser{
    private chunk_buffer: string
    private callback: chunk_on_complete
    constructor(message_callback: (obj: Object) => void){
        this.chunk_buffer = ''
        this.callback = (data: string, depth: number): boolean => {
            try{
                message_callback( JSON.parse(data) )
            }catch(e){
                return false
            }
            return true
        }
    }
    run(chunk: string): void{
        let chunk_buffer = this.chunk_buffer + chunk
        while(true){
            const result: IParseContext = lineParser(chunk_buffer, this.callback)
            if(result.code === PARSE_STATUS.DONE){
                this.chunk_buffer = result.chunk
                break;
            }
            else if(result.code === PARSE_STATUS.ABEND){
                throw new Error('JSON error: ' + result.chunk)
            }
            chunk_buffer = result.chunk
        }
    }
}
