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

Array.prototype.sliceByIndex = (idxs) => {
	const items = this;
	const slicedVals = idxs.map((idx) => items[idx]);
	return slicedVals;
}

const range = (min,max) => {
	let nums = [];
	for (let num = min; num <= max; num++){
		nums.push(num);
	}
	return nums;
}

Array.prototype.repeatedPermutation = (n) => {
	const items = this;
	const length = items.length;

	const idxs = range(0,length-1);
	let idxPerms = idxs.map((idx) => [idx]);

	for (let i = 0; i < n-1; i++){
		let nextIdxPerms = [];
		idxPerms.forEach((idxPerm) => {
			idxs.forEach((idx) => {
				let nextIdxPerm = idxPerm.slice(0);
				nextIdxPerm.push(idx);
				nextIdxPerms.push(nextIdxPerm);
			});
		});
		idxPerms = nextIdxPerms.slice(0);
	}

	perms = idxPerms.map((idxPerm) => items.sliceByIndex(idxPerm));
	return perms;
}


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
