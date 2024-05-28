document.getElementById('noteInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action to avoid form submission or newline in textarea
        saveNote(); // Call the saveNote function
    }
});

document.getElementById('saveNote').addEventListener('click', saveNote);

function saveNote() {
    const noteInput = document.getElementById('noteInput');
    const note = noteInput.value;
    const isEditing = noteInput.dataset.isEditing;

    if (note.trim() === '') {
        console.log('No note to save.');
        return; // Do nothing if the note is empty
    }

    if (isEditing) {
        updateNote(isEditing, note);
    } else {
        addNote(note);
    }
    noteInput.value = ''; // Clear the textarea after saving
    delete noteInput.dataset.isEditing;
}

function addNote(note) {
    chrome.storage.sync.get({notes: []}, function(data) {
        const notes = data.notes;
        notes.push(note);
        chrome.storage.sync.set({notes: notes}, loadNotes);
    });
}

function updateNote(index, note) {
    chrome.storage.sync.get({notes: []}, function(data) {
        data.notes[index] = note;
        chrome.storage.sync.set({notes: data.notes}, loadNotes);
    });
}

function deleteNote(index) {
    chrome.storage.sync.get({notes: []}, function(data) {
        data.notes.splice(index, 1);
        chrome.storage.sync.set({notes: data.notes}, loadNotes);
    });
}

function loadNotes() {
    chrome.storage.sync.get({notes: []}, function(data) {
        const notesList = document.getElementById('notesList');
        notesList.innerHTML = '';
        data.notes.forEach((note, index) => {
            let noteElement = document.createElement('li');
            let noteText = document.createElement('span');
            noteText.textContent = note;

            let editBtn = document.createElement('button');
            editBtn.innerHTML = '<span class="material-symbols-outlined">edit</span>';
            editBtn.setAttribute('class', 'editBtn');
            editBtn.onclick = function() {
                document.getElementById('noteInput').value = note;
                document.getElementById('noteInput').dataset.isEditing = index;
            };

            let deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<span class="material-symbols-outlined">delete</span>';
            deleteBtn.setAttribute('class', 'deleteBtn');
            deleteBtn.onclick = function() {
                deleteNote(index);
            };

            noteElement.appendChild(noteText);
            noteElement.appendChild(editBtn);
            noteElement.appendChild(deleteBtn);
            notesList.appendChild(noteElement);
        });
    });
}

window.onload = loadNotes;