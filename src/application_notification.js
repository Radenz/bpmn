import { Variables } from "camunda-external-task-client-js";
import { sendTextEmail } from "./mailer.js";
import { EMPLOYEE_STORE } from "./store.js";
import { client } from "./util.js";

export default function () {
  client.subscribe(
    "sendApplicationNotification",
    async function ({ task, taskService }) {
      console.log("[?] sendApplicationNotification Called");

      const processVariables = new Variables();

      const { variables } = task;
      const _ = variables.get("name");
      const employeeId = variables.get("id");
      const leaveDateRaw = variables.get("date");
      const leaveDate = new Date(Date.parse(leaveDateRaw));
      const leaveReason = variables.get("reason");

      // ? Set date string for approval form value
      if (leaveDateRaw) {
        console.log("[?] Setting `dateString` variable");
        processVariables.set("dateString", dateToString(leaveDate));
      }

      /**
       * @type {Employee[]}
       */
      const employees = EMPLOYEE_STORE.where(
        (employee) => employee.id === employeeId
      );

      const employee = employees.length > 0 ? employees[0] : null;
      console.log("[?] Sending notification to supervisor");
      if (employee)
        await notifyLeaveToSupervisor(employee, leaveDate, leaveReason);

      console.log(processVariables.getAll());
      await taskService.complete(task, processVariables);
    }
  );
}

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/**
 * Converts date object to Indonesian date text format
 * @param {Date} date
 */
function dateToString(date) {
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const month = MONTHS[monthIndex];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Sends an email to employee's supervisor's email
 * regarding leave request
 * @param {Employee} employee
 * @param {Date} date
 * @param {string} reason
 */
async function notifyLeaveToSupervisor(employee, date, reason) {
  const { supervisorKey } = employee;
  const supervisor = EMPLOYEE_STORE.get(supervisorKey);
  const { email } = supervisor;
  const dateString = dateToString(date);

  const subject = `Pengajuan Cuti ${employee.name}`;
  const body = `${employee.name} ingin mengajukan cuti pada tanggal ${dateString} karena ${reason}.`;
  await sendTextEmail(email, subject, body);
}
