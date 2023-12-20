import { ajax } from 'rxjs/ajax';
import { interval, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

const POLLING_INTERVAL = 5000;
const endpoint = 'http://localhost:3000/messages/unread';

const messages$ = interval(POLLING_INTERVAL).pipe(
  switchMap(() => ajax.getJSON(endpoint)),
  catchError(error => {
    console.error('Error:', error);
    throw new Error('Ошибка при получении сообщений. Пожалуйста, попробуйте еще раз.');
  })
);

messages$.subscribe(({ messages }) => {
  messages.forEach(addMessageToTable);
});

function formatDate(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const formattedDate = new Intl.DateTimeFormat('ru-RU').format(date);
  return `${formattedDate} ${hours}:${minutes}`;
}

function createCell(text) {
  const cell = document.createElement('td');
  cell.setAttribute('role', 'cell');
  cell.textContent = text;
  return cell;
}

function addMessageToTable(message) {
  const table = document.getElementById('root');
  const row = document.createElement('tr');
  row.setAttribute('role', 'row'); 
  
  const fromCell = createCell(message.from);
  const subjectCell = createCell(message.subject.length > 15 ? message.subject.slice(0, 15) + '...' : message.subject);
  const bodyCell = createCell(message.body);
  const receivedCell = createCell(formatDate(message.received));

  row.appendChild(fromCell);
  row.appendChild(subjectCell);
  row.appendChild(bodyCell);
  row.appendChild(receivedCell);

  table.appendChild(row)
}
