const taskForm = document.querySelector('#task-form');

const taskList = document.querySelector('.task-list');

const API_URL = "http://localhost:8080/tasks";

async function fetchTask() {

    try {

        const response = await fetch(API_URL);

        const tasks = await response.json();

        taskList.innerHTML = '';

        tasks.forEach(taks => {

            renderTask(taks);
            
        });

    } catch (error) {

        console.error("Erro ao buscar tarefas: ", error);

    }
    
}

taskForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const name = document.querySelector('#todo-name').value;
    const description = document.querySelector('#todo-desc').value;
    const startDate = document.querySelector('#todo-start-date').value;
    const endDate = document.querySelector('#todo-end-date').value;

    const newTask = {
        name: name,
        description: description,
        startDate: startDate,
        endDate: endDate,
        completed: false
    }

    try {

        const response = await fetch(API_URL, {

            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(newTask)

        });

        if (response.ok) {

            taskForm.reset();

            fetchTask();

        } else {

            const errorData = await response.json();

            alert("Erro: " + (errorData.message || "Verifiique as datas!"));

        }

    } catch (error) {

        alert("Não foi possivel conectar ao servidor Java.");

    }

});

async function toggleTask(task) {

     const updatedTask = {
        ...task,
        completed: !task.completed
    };

    try {

        const response = await fetch(`${API_URL}/${task.id}`, {

            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedTask)

        });

        if (response.ok) {

            fetchTask();

        }

    } catch (error) {

        console.error("Error:", error);

    }
    
}

async function deleteTask(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: 'DELETE'

        });

        if (response.ok) {

            fetchTask();

        } else {

            alert("Error ao excluir a tarefa do servidor.");

        }

    } catch (error) {

        console.error("Erro de Conexão:", error);

        alert("não foi possível falar com o servidor Java.");

    }

}

function renderTask(task) {

    const li = document.createElement('li');

    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    li.innerHTML = `
        <button class="button btn-check">
            <i class="${task.completed ? 'fa-solid' : 'fa-regular'} fa-circle-check"></i>
        </button>
        <div class="task-infor">
            <h3>${task.name}</h3>
            <p>${task.description}</p>
        </div>
        <div class="task-dates">
            <span>Início: ${task.startDate}</span>
            <span>Fím: ${task.endDate}</span>
        </div>
        <button class="button btn-delete"><i class="fa-solid fa-trash-can"></i></button>
    `;

    const checkBtn = li.querySelector('.btn-check');

    const deleteBtn = li.querySelector('.btn-delete');

    checkBtn.addEventListener('click', () => toggleTask(task));

    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    taskList.appendChild(li);

}

fetchTask();