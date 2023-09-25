import { sendTextEmail } from "./mailer.js";
import { EMPLOYEE_STORE, SUPERVISOR_STORE } from "./store.js";
import { client } from "./util.js";

export default function () {
  client.subscribe(
    "sendApprovalNotification",
    async function ({ task, taskService }) {
      const employeeName = task.variables.get("name");
      /**
       * @type {Employee[]}
       */
      const employees = EMPLOYEE_STORE.where(
        (employee) => employee.name === employeeName
      );

      const employee = employees.length > 0 ? employees[0] : null;
      if (employee) await notifyApplicant(employee);

      await taskService.complete(task);
    }
  );
}

/**
 * Sends an email to employee's email
 * regarding leave request approval
 * @param {Employee} employee
 */
async function notifyApplicant(employee) {
  const { email } = employee;

  const subject = `Persetujuan Pengajuan Cuti ${employee.name}`;
  const body = `Pengajuan cuti atas nama ${employee.name} telah disetujui.`;
  await sendTextEmail(email, subject, body);
}
