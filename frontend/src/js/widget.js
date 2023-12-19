import { doc } from 'prettier';
import { ajax } from 'rxjs/ajax';
import { interval } from 'rxjs/internal/observable/interval';
import { catchError } from 'rxjs/internal/operators/catchError';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { of } from 'rxjs';

const POLLING_INTERVAL = 5000;
const endpoint = 'http://localhost:3000/messages/unread';

const messages$ = interval(POLLING_INTERVAL).pipe(
  switchMap(() => ajax.getJSON(endpoint)),
  catchError(error => {
    console.error('Error:', error);
    return of({messages: []});
  })
);

messages$.subscribe(({ messages }) => {
  messages.forEach(addMessageToTable);
});

function addMessageToTable(message) {
  const table = document.getElementById('root');
  const row = document.createElement('tr');
  const idCell = document.createElement('td');
  const fromCell = document.createElement('td');
  const subjectCell = document.createElement('td');
  const bodyCell = document.createElement('td');
  const receivedCell = document.createElement('td');

  idCell.textContent = message.id;
  fromCell.textContent = message.from;
  subjectCell.textContent = message.subject.length > 15 ? message.subject.slice(0, 15) + '...' : message.subject;
  bodyCell.textContent = message.body;

  const date = new Date(message.received);
  const formattedDate = `${date.getHours()}:${date.getMinutes()}${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  receivedCell.textContent = formattedDate;

  row.appendChild(idCell);
  row.appendChild(fromCell);
  row.appendChild(subjectCell);
  row.appendChild(bodyCell);
  row.appendChild(receivedCell);

  table.appendChild(row)
}