const glob = require('glob');
const fs = require('fs');
const getClassesFromHtml = require('get-classes-from-html');

function extract(pattern) {
	glob(pattern, (err, files) => {

		const promises = files.map(f => {
			return new Promise((resolve, reject) => {
				fs.readFile(f, 'utf8', (err, data) => {
					if (err) {
						reject(err);
						return;
					}
					const classesFromFile = getClassesFromHtml(data);
					resolve(classesFromFile);
				});
			});
		});

		Promise.all(promises).then(classes=>{
			return [...new Set(classes.flat())]
		}).then(classes=>{
			fs.writeFile('./css-classes.txt', classes.join('\n'), {}, err => { });
		});
	});
}

module.exports = extract;