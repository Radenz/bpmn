import { Client, logger } from "camunda-external-task-client-js";

const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };

const client = new Client(config);

export { client };
