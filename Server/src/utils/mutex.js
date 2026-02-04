export class mutex {
    constructor(){
        this.locked = false;
    }
    async acquire(){
        while(this.locked){
            await new Promise(resolve=>setTimeout(resolve,1))
        }
        this.locked = true;
    }
    release(){
        this.locked = false;
    }
}