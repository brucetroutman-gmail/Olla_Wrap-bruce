from fastapi import FastAPI , WebSocket , WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import ollama
from ollama import AsyncClient
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from colorama import Fore , Style
import json
import base64
import time

app = FastAPI()

origins = [
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def base64_to_image(base64_string, output_file):
    try:
        image_data = base64.b64decode(base64_string)
        with open(output_file, "wb") as f:
            f.write(image_data)
        print(f"Image successfully saved to {output_file}")
    except Exception as e:
        print(f"An error occurred: {e}")

def colored_text(text,color=Fore.GREEN,level='INFO'):
    print(Style.BRIGHT+color+"["+level+"]"+"    "+Fore.RESET+text+Style.RESET_ALL)

class ConnectionManager:
    def __init__(self):
        self.active_connecitons = {}
    async def connect(self, websocket: WebSocket, client_id: str):
        if client_id in self.active_connecitons.keys():
            colored_text(f"Reconnecting with client {client_id}, closing old connection")
            await self.disconnect(self.active_connecitons[client_id]['websocket'], client_id)
        colored_text(f"Connecting with client {client_id}")
        await websocket.accept()
        self.active_connecitons[client_id] = {"websocket": websocket, "halt": False}
    async def disconnect(self, websocket: WebSocket, client_id: str):
        if client_id in self.active_connecitons:
            try:
                await self.active_connecitons[client_id]['websocket'].close()
            except:...
            del self.active_connecitons[client_id]
        colored_text(f"Connection wiht client id {client_id} is disconnected")
    async def send_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)



manager = ConnectionManager()

@app.get("/")
async def home():
    return HTMLResponse("Server is Running")

@app.get("/get_model_list")
async def get_model_list():
    l = ollama.list().models 
    model_list = [i.model for i in l]
    return JSONResponse(model_list)

@app.get("/halt_generation/{client_id}")
async def halt_generation(client_id:str):
    colored_text(f"Halting {client_id}")
    manager.active_connecitons[client_id]['halt']=True
    return JSONResponse(True)



@app.websocket('/chat/{client_id}')
async def chat_endpoint(websocket:WebSocket,client_id:str):
    await manager.connect(websocket,client_id)
    manager.active_connecitons[client_id]['halt']=False
    messages = []
    try:
        while True:
            is_image=False
            data = await websocket.receive_text()
            if json.loads(data)['file']!=None:
                file = json.loads(data)['file']
                base64_to_image(file,'static/img.png')
                is_image=True
            data = dict(json.loads(data))
            model = data['model']
            data = data['content']
            messages.append({'role': 'user', 'content': data,'images':['static/img.png'] if is_image else []})
            manager.active_connecitons[client_id]['halt'] = False
            response = {"status": "start", "message": "<START>"}
            await manager.send_message(json.dumps(response),websocket)
            response = {
                "status":"message",
                "content":f"""###### User <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/></svg>  \n```\n{data}\n``` \n """
                }
            await manager.send_message(json.dumps(response),websocket)
            if is_image:
                response = {
                    'status':'message',
                    'content':f'\n<img width=300px src="data:image/png;base64,{file}"/><br></br>'
                }
                await manager.send_message(json.dumps(response),websocket)
            response = {
                "status":"message",
                "content":f"""\n###### Assistant <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16"><path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/></svg>\n"""
                }
            await manager.send_message(json.dumps(response),websocket)
            assistant_response=''
            num_tokens=0
            st=time.time()
            async for part in await AsyncClient().chat(model=model, messages=messages, stream=True):
                if manager.active_connecitons[client_id]['halt']:break
                response = {"status": "message", "content": part['message']['content']}
                await websocket.send_text(json.dumps(response))
                num_tokens+=1
                assistant_response+=part["message"]['content']
            ed=time.time()
            avrage_speed = f"{(num_tokens/(ed-st)):.2f}"
            messages.append({
                'role':'assistant',
                'content':assistant_response
            })
            response = {"status": "message", "content": f"\n\n```\nNum Tokens : {str(num_tokens)}\nAvrage Speed : {avrage_speed} tokens/second\n```\n"}
            await websocket.send_text(json.dumps(response))
            response = {"status": "message", "content": "<br><hr>\n"}
            await websocket.send_text(json.dumps(response))
            response = {"status": "end", "message": "<END>"}
            await websocket.send_text(json.dumps(response))
    except WebSocketDisconnect:
        await manager.disconnect(websocket,client_id)
        colored_text(f"Connection wiht client id {client_id} is disconnected")