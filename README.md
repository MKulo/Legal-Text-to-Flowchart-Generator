
# Legal Text to Flowchart Generator

This application was created as final project for the class "Interdisciplinary Introduction to Legal Tech – a Practical Seminar".
Convert your legal text to a flowchart by choosing a model and pasting your code.


## Installation ans Setup

After cloning the repository, you need to set up the application. You need [npm and node](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). I am using version v18.19.1, others might work as well.

After installing npm and node, set up the project by running the following commands (in root folder):

```bash
npm init -y
cd frontend
npm install express
npm install cors
npm install path
npm install url
npm install ollama
npm install dotenv
```
This should create a file called "package.json" in your root folder and a folder nadem "node_modules". Open package.json and add the line
```bash
    "type": "module",
```
For example, in between the lines "description" and "main".

For accessing Ollama cloud models, you need an api key. Create a .env file in the root folder and add:
```bash
OLLAMA_API_KEY=your-api-key
```

More information on how to use Ollama can be found [here](https://ollama.com/blog/cloud-models).

Now we're good to go! Navigate to your root folder and type:
```bash
node server.js
````
to start the application!

Open localhost:3000 in your browser and start pasting legal text.

## Mermaid Chart

If you want to learn more about the mermaid chart syntax, visit their [official website](https://www.mermaidchart.com/)!