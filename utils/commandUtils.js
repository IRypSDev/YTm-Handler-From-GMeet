export function splitCommandAndQuery( string ) {

    let regex = /(\w+)\s(.*)/;
    let matches = string.match(regex);

    if (!matches) {
        return { command: string, query: "" };
    }

    return { command: matches[1], query: matches[2] };
    
}


export function makeCommandsListMessage( functionsDataArray = [] ) {

    if ( !functionsDataArray || functionsDataArray.length == 0 ) return null;

    let finalMessage = ``;

    functionsDataArray.forEach( (functionData) => {
        finalMessage += `• ${functionData.icon} ${functionData.commandName}: ${functionData.description}\n`;
    });

    return finalMessage;
}