import { client } from "./util.js";
import 'dotenv/config';
import axios from "axios";

export default function () {
    client.subscribe(
        "menyimpanInformasiCutiKaryawan",
        async function ({ task, taskService }) {
            const variables = task.variables;
            const url = "http://localhost:" + process.env.PORT + "/cuti";

            console.log(url);

            const jsonData = {
                NIP: variables.get("nip"),
                tanggal: variables.get("tanggal"),
                alasan: variables.get("alasan"),
            }

            axios.post(url, jsonData, {
                headers: {
                  'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log('Response data:', response.data);
            })
            .catch(error => {
                console.error('Error:', error.message);
            });

            await taskService.complete(task);
        }
    );
}
