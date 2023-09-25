import { client } from "./util.js";

export default function () {
  client.subscribe(
    "sendApplicationNotification",
    async function ({ task, taskService }) {
      console.log("sendApplicationNotification is Called");

      // TODO: impl

      await taskService.complete(task);
    }
  );
}
