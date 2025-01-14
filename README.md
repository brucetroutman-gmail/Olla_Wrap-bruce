<h1 align="center">OllamaWrapper</h1>
<div align="center"><img width=300px src='ollama.png'/></div>
<p align="center">Repository for OllamaWrapper a GUI Wrapper for Ollama</p>

---

<h3 align="center">Demo Video</h3>



https://github.com/user-attachments/assets/62c188b9-683b-4f8b-b394-bfe8a5f5d5c9



---

<h3 align="center">Installation</h3>

* clone the repo 
    ```bash
    git clone https://github.com/Lakshit-Karsoliya/OllamaWrapper.git
    ```
* Move to project directory
    ```bash
    cd OllamaWrapper
    ```
* Make a python Virtual environment
    ```bash
    virtualenv env
    ```
    <p align='center'>or</p>

    ```bash
    pip install virtualenv 
    python -m venv env
    ```
* Activate environment
    * Linux
        ```bash
        source env/bin/activate
        ```
    * Windows
        ```bash
        env\Scripts\activate
        ```
* Install requirements
    * Linux
        ```bash
        pip install -r requirements_linux.txt
        ```

    * Windows
        * windows won't support uvloop thats why requirements_win.txt
        ```bash
        pip install -r requirements_win.txt
        ```
* Install NodeModules 
    ```bash
        cd frontend/frontend
        npm i
    ```

<h3 align="center">RunningOllamaWrapper</h3>

* Linux

    * Open ```run_wrapper.sh``` in project folder 
    * Replace ```BASE_DIR``` with your path ```path/to/OllamaWrapper``` , currently in file my path is there for example
    * Give required Permissions to .sh file
    * ```optional``` make a ```.desktop``` file that as shown in demo which trigger the run_wrapper.sh script

* Windows

    * Open ```run_wrapper.bat``` in project folder 
    * Replace ```BASE_DIR``` with your path ```path/to/OllamaWrapper``` , currently in file my path is there for example 
    * Run ```run_wrapper.bat ``` file in cmd 

* Run Manually

    * Navigate to backend folder and run 
        ```bash 
        uvicorn backend:app --host 0.0.0.0 --port 8000 --reload
        ```
    * For frontend navigate to ```frontend/frontend``` then run 
        ```bash
        npm start
        ```


This will turn on 

frontend at ```http://localhost:3000``` or ```http://127.0.0.1:3000```

Backend at ```http://localhost:8000``` or ```http://127.0.0.1:8000```




<h4 align='center'>Made with ❤️ by Lakshit </h4>


