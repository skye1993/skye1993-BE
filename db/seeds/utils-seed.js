function createLookObj(arr,key,value){
 const obj = {}

 if(arr.length === null){
    return {}
 }

 arr.forEach((object) => {
    const lookKey = object[key]
    const lookValue = object[value]
    obj[lookKey] = lookValue
 })
 return obj;
}

module.exports = createLookObj;