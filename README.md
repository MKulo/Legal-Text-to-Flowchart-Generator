
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
```
This should create a file called "package.json" in your root folder and a folder nadem "node_modules". Open package.json and add the line
```bash
    "type": "module",
```
For example, in between the lines "description" and "main".
As this project uses Ollama Cloud, you have to sign in using your own Ollama account first. Navigate to the folder "frontend" and type:
```bash
ollama signin
```
More information on how to use Ollama can be found [here](https://ollama.com/blog/cloud-models).

Now we only need some models. In the current application, there are 5 cloudbased LLMs to choose from: 
- qwen3-coder:480b-Cloud (default)
- llama3.1
- Phi-4
- GPT-oss 120b

You can install them using the following command:
```bash
ollama run qwen3-coder:480b-cloud
ollama run llama3.1
ollama run phi4
ollama run gpt-oss:120b-cloud
```
If you only want to use one model (which saves setup time as well) this is possible as well, but the application will not work if you choose a model from the dropdow which you didn't run previously.

Now we're good to go! Navigate to your root folder and type:
```bash
node server.js
````
to start the application!

Open localhost:3000 in your browser and start pasting legal text.
## Mermaid Chart

If you want to learn more about the mermaid chart syntax, visit their [official website](https://www.mermaidchart.com/)!