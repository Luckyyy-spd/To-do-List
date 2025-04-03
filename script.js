const input = document.getElementById('todoInput');
const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');
const list = document.getElementById('todoList');
let todos = [];
let editingIndex = -1;

const now = new Date();
dateInput.value = now.toISOString().split('T')[0];
timeInput.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

function formatDateTime(date, time) {
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');
    return `${day}/${month} ${hours}:${minutes}`;
}

function show() {
    list.innerHTML = '';
    const filter = document.getElementById('filter').value;
    
    todos.forEach((todo, i) => {
        if ((filter === 'active' && todo.done) || (filter === 'done' && !todo.done)) return;

        const tr = document.createElement('tr');
        if (i === editingIndex) {
            tr.className = 'edit-mode';
            tr.innerHTML = `
                <td></td>
                <td><input type="text" value="${todo.text}" id="editInput"></td>
                <td>
                    <input type="date" value="${todo.fullDate}" id="editDate">
                    <input type="time" value="${todo.time}" id="editTime">
                </td>
                <td class="action-buttons">
                    <button onclick="saveEdit(${i})">Save</button>
                    <button onclick="cancelEdit()">Cancel</button>
                </td>
            `;
        } else {
            const statusLabel = todo.done ? 'Complete' : 'Pending';
            const statusClass = todo.done ? 'status-complete' : 'status-pending';
            
            tr.innerHTML = `
                <td class="status-cell">
                    <span class="status-icon" onclick="toggle(${i})">
                        ${todo.done ? '✓' : '○'}
                    </span>
                    <span class="status-label ${statusClass}">${statusLabel}</span>
                </td>
                <td class="${todo.done ? 'done' : ''}">${todo.text}</td>
                <td>${todo.displayDate}</td>
                <td class="action-buttons">
                    <button class="edit-btn" onclick="edit(${i})">Edit</button>
                    <button class="delete-btn" onclick="remove(${i})">×</button>
                </td>
            `;
        }
        list.appendChild(tr);
    });
}

function add() {
    const text = input.value.trim();
    if (text) {
        if (confirm(`Add new task: "${text}"?`)) {
            todos.push({
                text: text,
                done: false,
                fullDate: dateInput.value,
                time: timeInput.value,
                displayDate: formatDateTime(dateInput.value, timeInput.value)
            });
            input.value = '';
            show();
        }
    } else {
        alert('Please enter a task description');
    }
}

function edit(i) {
    if (confirm(`Edit task: "${todos[i].text}"?`)) {
        editingIndex = i;
        show();
    }
}

function saveEdit(i) {
    const editInput = document.getElementById('editInput');
    const editDate = document.getElementById('editDate');
    const editTime = document.getElementById('editTime');
    const newText = editInput.value.trim();
    
    if (newText) {
        if (confirm(`Save changes to task: "${todos[i].text}" → "${newText}"?`)) {
            todos[i].text = newText;
            todos[i].fullDate = editDate.value;
            todos[i].time = editTime.value;
            todos[i].displayDate = formatDateTime(editDate.value, editTime.value);
            editingIndex = -1;
            show();
        }
    } else {
        alert('Task description cannot be empty');
    }
}

function cancelEdit() {
    if (confirm('Cancel editing? Any changes will be lost.')) {
        editingIndex = -1;
        show();
    }
}

function toggle(i) {
    const newStatus = !todos[i].done;
    const action = newStatus ? 'complete' : 'mark as pending';
    if (confirm(`Mark task "${todos[i].text}" as ${action}?`)) {
        todos[i].done = newStatus;
        show();
    }
}

function remove(i) {
    if (confirm(`Delete task: "${todos[i].text}"?`)) {
        todos.splice(i, 1);
        show();
    }
}

input.addEventListener('keypress', e => {
    if (e.key === 'Enter') add();
});

show(); 