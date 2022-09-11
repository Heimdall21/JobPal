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
- If you are lost, you may try to follow this link https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked

2. Modifying the extension after added to Chrome

- Make changes to the extension
- Run `npm run build` to update the `dist` folder.
- Click the reload button of the extension in chrome://extensions
- Changes should now be applied on the browser!

3. Edit your profile
- You can right click on any page in the browser, and a context menu would pop up
- Click the option "Edit JOBPAL Prefill Form"
- A form should be opened in a new tab! 
- Fill in your personal information so our extension can fill them in for in other job application forms later!
(Note that we are not going to send these info to any server, they are stored in the chrome sync storage)
- You can add keys and valus for fields taht we have not include.
- You can also add some specific keys and values for some specific website in the "Information For Specific Job Applications" section
- After editing, click "Save" to store them in the chrome sync storage.

4. Prefill job application form
- Go to any **Website**(something starts with "http://" or "https://") with job application form
- Click the extension button and select "Job Extension" to start our extension
- Our app should pop up on the right, and shows what it can prefill after analysing the webiste
- You can click "Prefill All" to prefill your job application form
- You can minimize it, close it or edit the form as well.
