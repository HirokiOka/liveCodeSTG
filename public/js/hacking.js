const c = 'a'.charCodeAt(0);
const alphabets = Array.apply(null, new Array(26)).map((v, i) => {
    return String.fromCharCode(c + i);
});
const numbers = [...Array(10).keys()];
const elements = alphabets.concat(numbers);

function guess(player, password) {
    if (player.password === password) {
        commandOutput.setValue(`Success! password: ${player.password}`);
        if (player === player2) {
            aceEditor2.setValue(player.code);
        } else if (player === player1) {
            aceEditor1.setValue(player.code);
        }
    } else {
        commandOutput.setValue("Failure");
    }
}

Array.prototype.sliceByIndex = function(idxs){
	let items = this;
	let slicedVals = idxs.map(function(idx){
		return items[idx];
	});
	return slicedVals;
}

const range = function(min,max){
	let nums = [];
	for (let num = min; num <= max; num++){
		nums.push(num);
	}
	return nums;
}

Array.prototype.repeatedPermutation = function(n){
	let items = this;
	let length = items.length;

	let idxs = range(0,length-1);
	let idxPerms = idxs.map(function(idx){
		return [idx];
	});

	for (let i = 0; i < n-1; i++){
		let nextIdxPerms = [];
		idxPerms.forEach(function(idxPerm){
			idxs.forEach(function(idx){
				let nextIdxPerm = idxPerm.slice(0);
				nextIdxPerm.push(idx);
				nextIdxPerms.push(nextIdxPerm);
			});
		});
		idxPerms = nextIdxPerms.slice(0);
	}

	perms = idxPerms.map(function(idxPerm){
		return items.sliceByIndex(idxPerm);
	});
	return perms;
}

// const bruteForce = (player, passwordLength) => {
//     if (passwordLength > 4) { return; }
//     let p = elements.repeatedPermutation(passwordLength);

//     p.forEach((e) => {
//         if (e.join('') === player.password) {
//             if (player === player2) {
//                 aceEditor2.setValue(player.code);
//             } else if (player === player1) {
//                 aceEditor1.setValue(player.code);
//             }
//             commandOutput.setValue(`Success! password: ${player.password}`);
//             return;
//         }
//     });
//     commandOutput.setValue("Failure");
// }

const bruteForce = (player, passwordLength) => {
    if (passwordLength > 4) { return; }
    const process = new Promise((resolve, reject) => {

        let p = elements.repeatedPermutation(passwordLength);
        
        p.forEach((e) => {
            if (e.join('') === player.password) {
                resolve(`Success! password: ${player.password}`);
            }
        });
        reject('Failure...');
    });

    process.then((message) => {
        if (player === player2) {
            aceEditor2.setValue(player.code);
        } else if (player === player1) {
            aceEditor1.setValue(player.code);
        }
        commandOutput.setValue(message);
    }).catch((message) => {
        commandOutput.setValue(message);
    })
}


