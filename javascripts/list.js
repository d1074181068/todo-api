const APIurl = 'https://todoo.5xcamp.us'

const all_todo = []
const user = document.querySelector('#user_account')
const list_bar = document.querySelector('#list_bar')
const all_bar_li = document.querySelectorAll('#list_bar>li')
let todo_item;
const checked = document.querySelector('#checked')
const checkbox = document.querySelector('.form-check-input')
const search_btn = document.querySelector('#search_btn')
const search_input = document.querySelector('#search')
const alert_txt = document.querySelector('#alert_txt')
const modal = document.querySelector('#list_modal')
const listModal = new bootstrap.Modal(modal, {})
const list_items = document.querySelector('#list_items')

user.textContent = localStorage.getItem('name')
let html_txt = '';
render();

list_bar.addEventListener('click', (e) => {
    bar_reset();
    e.target.classList.add('active')
})

search_btn.addEventListener('click', () => {
    if (search_input.value !== '') {
        const add_item = search_input.value;
        add_todo(add_item)
    } else {
        alert_txt.textContent = '你要新增的項目不可為空 ! ';
        listModal.show();
        return
    }

})

function item_listener() {
    for (i = 0; i < todo_item.length; i++) {
        todo_item[i].addEventListener('click', (e) => {
            if (e.target.classList.contains('bi-x-lg') == true) {
                // 刪除todo
            } else if (e.target.classList.contains('todo_item')) {
                const target_element = e.target.children['0'].children;
                target_element['0'].classList.toggle('d-none');
                target_element['1'].classList.toggle('d-none');
                target_element['2'].classList.toggle('active');
            } else if (e.target.classList.contains('form-check-label')) {
                e.target.classList.toggle('active')
                e.target.previousElementSibling.classList.toggle('d-none')
                e.target.previousElementSibling.previousElementSibling.classList.toggle('d-none')
            }
        })
    }

}


function add_todo(item) {
    console.log('新增中');

    axios.post(`${APIurl}/todos`,
        {
            "todo": {
                "content": item
            }
        },
        {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }
    )
        .then(
            res => {
                render();
            }
        )
        .catch(
            error => {
                console.log(error);
            }
        )
    search_input.value = ''

}

function render() {
    all_todo.splice(0, all_todo.length)
    html_txt = '';
    axios.get(`${APIurl}/todos`,
        {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })

        .then(res => {
            res.data.todos.forEach(item => {
                all_todo.push(item)
            });
            html_render()
        })
        .catch(
            error => {
                console.log(error);
            }
        )
}

function html_render() {
    all_todo.forEach((item, index) => {
        html_txt += `
            <div class="todo_item d-flex justify-content-between align-items-center mb-3" id="todo_item">
                <div class="form-check ps-0 d-flex align-items-center">
                    <input class="form-check-input ms-2 me-3 " type="checkbox">
                    <i class="bi bi-check-lg me-3 d-none"></i>
                    <label class="form-check-label mt-1">
                        ${item.content}
                    </label>
                </div>
                <i class="bi bi-x-lg"></i>
            </div>
        `;
    })

    list_items.innerHTML = html_txt;
    todo_item = document.querySelectorAll('#todo_item')
    item_listener()
}

function bar_reset() {
    for (const item of all_bar_li) {
        item.classList.remove('active')
    }
}

/**
 * <div class="todo_item d-flex justify-content-between align-items-center mb-3" id="todo_item">
                    <div class="form-check ps-0 d-flex align-items-center">
                        <input class="form-check-input ms-2 me-3 " type="checkbox">
                        <i class="bi bi-check-lg me-3 d-none"></i>
                        <label class="form-check-label mt-1">
                            明天畢業典禮
                        </label>
                    </div>
                    <i class="bi bi-x-lg"></i>
                </div>
 */