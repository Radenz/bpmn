import { client } from "./util.js";
import "dotenv/config";
import axios from "axios";
import { Variables } from "camunda-external-task-client-js";

export default function () {
  client.subscribe(
    "menyimpanInformasiCutiKaryawan",
    async function ({ task, taskService }) {
      console.log("[?] menyimpanInformasiCutiKaryawan Called");

      const { variables } = task;
      const url = "http://localhost:" + process.env.PORT + "/cuti";

      const jsonData = {
        id: variables.get("id"),
        date: variables.get("date"),
        reason: variables.get("reason"),
      };

      const responseStatus = new Variables();

      await axios
        .post(url, jsonData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("Response data:", response.data);
          responseStatus.set("responseStatus", "success");
        })
        .catch((error) => {
          console.error("Error:", error.message);
          responseStatus.set("responseStatus", "fail");
        });

      await taskService.complete(task, responseStatus);
    }
  );
}
