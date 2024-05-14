export function splitCommandAndQuery( string ) {

    let regex = /(\w+)\s(.*)/;
    let matches = string.match(regex);

    if (!matches) {
        return { command: string, query: "" };
    }

    return { command: matches[1], query: matches[2] };
    
}