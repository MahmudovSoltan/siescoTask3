import * as signalR from "@microsoft/signalr";

export const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7046/filehub", {
    accessTokenFactory: () => localStorage.getItem("accessToken") || "" // <-- DƏYƏRİ BURADA OXU
  })
  .withAutomaticReconnect()
  .build();
  