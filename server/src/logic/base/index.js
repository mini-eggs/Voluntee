class Base {
    constructor(params){
    	this.params = params
    }
    get(){
    	return new Promise((resolve,reject) => {
    		resolve(this.params)
    	})
    }
}

export default Base