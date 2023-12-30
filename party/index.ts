import type * as Party from "partykit/server";
import type { Note } from "../src/components/PianoKeys";

export interface NoteMessage {
  username: string;
  note: Note;
}

export default class Server implements Party.Server {
  // eslint-disable-next-line no-unused-vars
  constructor(readonly party: Party.Party) { }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    // eslint-disable-next-line no-console
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.party.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    // let's send a message to the connection
    conn.send(
      JSON.stringify({
        username: "server",
        note: "C4",
      } as NoteMessage)
    );
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    this.party.broadcast(message, [
      // ...except for the connection it came from
      // sender.id,
    ]);
  }
}

Server satisfies Party.Worker;
