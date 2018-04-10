
export const makeRequest = (method: string, params: Array<any>, id: number): string => {
    return JSON.stringify({
        jsonrpc : "2.0",
        method : method,
        params : params,
        id : id,
    })
}

export const createPromiseResult = (resolve: (v: any) => void, reject: (e: Error) => void) => {
    return (err: Error, result: any): void => {
        if(err) reject(err)
        else resolve(result)
    }
}

