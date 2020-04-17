const vscode = require('vscode');
const scaffold = require('scaffold-react-component/core').Scaffold;

/**
 * Scaffold a component in place and open the editor for the JS component file
 * @param {string} path Path to create component
 * @param {string} type  Type of component
 */
const scaffoldAndOpen = async (path, type) => {

	const name = await askForInput('Enter the name of the component to create', 'e.g. MyComponent');
	if(!name) return;

	const category = await askForInput('Enter the Storybook category, e.g. Common, UI', undefined, 'Common');
	if(!category) return;
	
	process.chdir(path);

	scaffold(name, type, category).then((file) => {
		vscode.workspace.openTextDocument(file).then(doc => {
			vscode.window.showTextDocument(doc).then(() => {
				vscode.window.showInformationMessage(`Component: ${name} was created succesfully.`);
			});
		});
	}).catch((err) => {
		vscode.window.showErrorMessage(`Component: ${name} could not be created.`);
		throw err;
	});	
	
};

/**
 * Display a VS Code input box with the given options
 * @param {string} [prompt] Text to show below input
 * @param {string} [placeholder] Placeholder text in input
 * @param {string} [value] Initial value
 */
const askForInput = async (prompt, placeholder, value) => {
	return await vscode.window.showInputBox({
		placeHolder: placeholder,
		prompt: prompt,
		value: value
	});
};

/** 
 * Sets up the commands to be used.
 * Invoked the first time the extension is used.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposableFunctional = vscode.commands.registerCommand('scaffold-react-component-vscode.scaffoldFunctional', async (folderObject) => {
		await scaffoldAndOpen(folderObject.fsPath, 'functional');		
	});

	let disposableClass = vscode.commands.registerCommand('scaffold-react-component-vscode.scaffoldClass', async (folderObject) => {
		await scaffoldAndOpen(folderObject.fsPath, 'class');
	});

	context.subscriptions.push(disposableFunctional, disposableClass);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
