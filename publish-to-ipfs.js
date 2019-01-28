var path = require('path');
var fs = require('fs');
var ipfsAPI = require('ipfs-http-client');

// function walkSync (dir, filelist = []) {
//     fs.readdirSync(dir).forEach(file => {
//         const dirFile = path.join(dir, file);
//         try {
//             filelist = walkSync(dirFile, filelist);
//         }
//         catch (err) {
//             if (err.code === 'ENOTDIR' || err.code === 'EBUSY') filelist = [...filelist, dirFile];
//             else throw err;
//         }
//     });
//     return filelist;
// }
//
// let rs = walkSync(path.resolve(__dirname, 'build'))
// console.log(rs)
//
// let filesprod = []
// rs.forEach(file => {
//     filesprod.push({path: file, content: fs.readFileSync(file)})
// })
// console.log(filesprod)

console.log(`Deploying to IPFS for: ${process.env.NODE_ENV}`)
// Default settings
let ipfs = process.env.NODE_ENV === 'development' ? new ipfsAPI():
    new ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

// node id
var id;

ipfs.id().then(response => {
	id = response.id;
	console.log('id', id);
	return uploadToIPFS();
})
.catch(function (err) {
	console.log('error during main', err);
});

function uploadToIPFS() {
	var dirpath = path.resolve(__dirname, 'build');
    // var dirpath = path.resolve('./', 'build');
	console.log('dirpath', dirpath);
    return ipfs.addFromFs(dirpath, {recursive: true})
    // return ipfs.add(filesprod, {recursive: true})
	.then(result => {
		console.log('length of result', result.length);
		/*
		 * To combat the following bug, we are searching for
		 * the path which starts at public and publishing
		 * that one, instead of the erronious almost-root
		 * path.
		 * https://github.com/ipfs/js-ipfs-api/issues/408
		 */
		var lastHash;
		for (var i = 0; i < result.length; i++) {
			var file = result[i];
			if (/build$/.test(file.path)) {
				lastHash = file.hash;
				break;
			}
		}
		console.log('lashHash', lastHash);
		return ipfs.name.publish(lastHash);
	})
	.then(() => {
		console.log(`dApp is published at http://localhost:8080/ipns/${id}`)
        console.log(`or https://ipfs.io/ipns/${id}`);
	})
	.catch(err => {
		console.log('error caught', err);
	});
}
