# JobPal
Easier job applications with JobPal!
JobPal is a chrome extension that allows you to pre-fill common fields when applying for jobs such as name, phone number, email, degree, GitHub links etc.

## Set up
Clone the repository and install the required dependencies
```sh
git clone https://github.com/Heimdall21/JobPal.git
cd JobPal/jobpal-extension
npm install
npm run build
```

## How to use extension

1. How to add the extension to Chrome

- Run `npm run build`. A `dist` folder will be generated.
- In Chrome, go to chrome://extensions.
- Click the 'load unpackaged' button.
- Select the `dist` folder.
- You can now use the extension!

2. Modifying the extension after added to Chrome

- Make changes to the extension
- Run `npm run build` to update the `dist` folder.
- Click the reload button of the extension in chrome://extensions
- Changes should now be applied on the browser!
