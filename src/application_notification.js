import { sendTextEmail } from "./mailer.js";
import { EMPLOYEE_STORE, SUPERVISOR_STORE } from "./store.js";
import { client } from "./util.js";

export default function () {
  client.subscribe(
    "sendApplicationNotification",
    async function ({ task, taskService }) {
      const employeeName = task.variables.get("name");
      /**
       * @type {Employee[]}
       */
      const employees = EMPLOYEE_STORE.where(
        (employee) => employee.name === employeeName
      );

      const employee = employees.length > 0 ? employees[0] : null;
      if (employee) await notifySupervisor(employee);

      await taskService.complete(task);
    }
  );
}

/**
 * Sends an email to employee's supervisor's email
 * regarding leave request
 * @param {Employee} employee
 */
async function notifySupervisor(employee) {
  const { supervisorKey } = employee;
  const supervisor = EMPLOYEE_STORE.get(supervisorKey);
  const { email } = supervisor;

  const subject = `Pengajuan Cuti ${employee.name}`;
  const body = `${employee.name} ingin mengajukan cuti.`;
  await sendTextEmail(email, subject, body);
}
