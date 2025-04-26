export async function grog(text: string){
    try{
        const txt = await Deno.readTextFileSync('logs.log');
        await Deno.writeTextFileSync('logs.log', txt + '\n' + text);
    }catch(err){
        console.log('ERROR - ERROR - ERROR - ERROR - ERROR - ERROR - ERROR - ERROR - ERROR - ERROR')
    }
}