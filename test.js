/*take an array, filter every false value, 
not mute the original array, return new array */


function filerArray(arr){
    let res = [];
    for(let i = 0; i<arr.length;i++){
        if(Boolean(arr[i])){
            res.push(arr[i]);
        }
    }
    return res;
}
let val = true;
let arr1 = ["dog", 0, false, true, val, 100, undefined, ""];
console.log(filerArray(arr1));
console.log(arr1);
console.log(Boolean("dog"));
