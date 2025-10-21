// scripts/list-files.js
import fs from 'fs';
import path from 'path';

const getFileType = (stats) => {
	if (stats.isFile()) return 'file';
	if (stats.isDirectory()) return 'directory';
	if (stats.isSymbolicLink()) return 'symlink';
	return 'other';
};

// const dir = '../../__mocks__'; // TODO use the mocks folder
const initialDirectory = './';
const getFiles = (directory) => {
	return fs.readdirSync(directory).map((file) => {
		const stats = fs.statSync(path.join(directory, file));
		return {
			name: file,
			type: getFileType(stats),
			...stats,
		};
	});
};

// console.log(getFiles(initialDirectory)); // TODO trace

fs.writeFileSync('./assets/fileList.json', JSON.stringify(getFiles(initialDirectory), null, 2));
