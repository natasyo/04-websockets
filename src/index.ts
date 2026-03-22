import { WebSocketServer} from "ws";
import { AccountController } from "./account/controller.js";
import { AccountService } from "./account/service.js";

const wss = new WebSocketServer({ port: 8080 });
const accountService=new AccountService()
const accountController=new AccountController(accountService)
wss.on("connection", (ws) => {
  console.log("connection connected");
  ws.send("Server connected");
  ws.on("message", (data) => {
    const dataMessage = JSON.parse(data.toString());
    console.log("Received message", dataMessage);
    const type = dataMessage.type;
    switch (type) {
      case "reg":
        accountController.addUser(ws,dataMessage.data)
        break;
      default:
        console.log("Command not found");
        break;
    }

    ws.send("Message received");
  });

  ws.on("close", (code: any) => {
    console.log("connection disconnected", code);
  });
});
