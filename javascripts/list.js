const APIurl = 'https://todoo.5xcamp.us'
const all_todo = []
const user = document.querySelector('#user_account')
const header_logout = document.querySelector('.header_logout');
const list_bar = document.querySelector('#list_bar')
const all_bar_li = document.querySelectorAll('#list_bar>li')
const checked = document.querySelector('#checked')
const checkbox = document.querySelector('.form-check-input')
const search_btn = document.querySelector('#search_btn')
const search_input = document.querySelector('#search')
const alert_txt = document.querySelector('#alert_txt')
const modal = document.querySelector('#list_modal')
const listModal = new bootstrap.Modal(modal, {})
const list_items = document.querySelector('#list_items')
const item_count = document.querySelector('#item_count');
let html_txt = '';
let todo_item;
let logout_btn;

// init start
check_token();

if (sessionStorage.getItem('token')) {
    render();
}

if (logout_btn) {
    logout_btn.addEventListener('click', () => {
        sessionStorage.removeItem('token')
        check_token()
        document.location.href = './login.html';
    })
}

// init end

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
            const target = e.target
            if (target.classList.contains('bi-x-lg') == true) {
                // 刪除todo
                const del_todo_id = target.parentElement.dataset.index;
                const del_todo_key = find_key(del_todo_id)
                del_todo(del_todo_key);

            } else if (target.classList.contains('todo_item')) {
                const target_element = target.children['0'].children;
                const target_data_index = target.dataset.index;
                const patch_key = find_key(target_data_index);
                todo_done(patch_key);
                target_element['0'].classList.toggle('d-none');
                target_element['1'].classList.toggle('d-none');
                target_element['2'].classList.toggle('active');
            } else if (target.classList.contains('form-check-label')) {
                const target_data_index = target.parentElement.parentElement.dataset.index;
                const patch_key = find_key(target_data_index);
                todo_done(patch_key);
                target.classList.toggle('active')
                target.previousElementSibling.classList.toggle('d-none')
                target.previousElementSibling.previousElementSibling.classList.toggle('d-none')
            } else if (target.classList.contains('form-check-input')) {
                const target_data_index = target.parentElement.parentElement.dataset.index;
                const patch_key = find_key(target_data_index);
                todo_done(patch_key);
                target.classList.toggle('d-none');
                target.nextElementSibling.classList.toggle('d-none');
                target.nextElementSibling.nextElementSibling.classList.toggle('active')
            } else if (target.classList.contains('bi-check-lg')) {
                const target_data_index = target.parentElement.parentElement.dataset.index;
                const patch_key = find_key(target_data_index);
                todo_done(patch_key);
                target.classList.toggle('d-none')
                target.previousElementSibling.classList.toggle('d-none');
                target.nextElementSibling.classList.toggle('active');
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
                Authorization: sessionStorage.getItem('token')
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
function del_todo(key) {
    axios.delete(`${APIurl}/todos/${key}`,
        {
            headers: {
                Authorization: sessionStorage.getItem('token')
            }
        })
        .then(res => {
            render();
        })
        .catch(
            error => {
                console.log(error);
            }
        )
}

function todo_done(key) {
    axios.patch(`${APIurl}/todos/${key}/toggle`, {}, {
        headers: {
            Authorization: sessionStorage.getItem('token')
        }
    })
        .then(
            res => {
                console.log(res);
            }
        )
        .catch(
            error => {
                console.log(error);
            }
        )
}
function render() {
    all_todo.splice(0, all_todo.length)
    html_txt = '';
    axios.get(`${APIurl}/todos`,
        {
            headers: {
                Authorization: sessionStorage.getItem('token')
            }
        })

        .then(res => {
            res.data.todos.forEach(item => {
                all_todo.push(item)
            });
            html_render()
            item_count.textContent = all_todo.length;
        })
        .catch(
            error => {
                console.log(error);
            }
        )
}
function find_key(index) {
    const current_item = all_todo[index].id;
    return current_item;
}
function html_render() {
    all_todo.forEach((item, index) => {
        if (item.completed_at === null) {
            html_txt += `
            <div class="todo_item d-flex justify-content-between align-items-center mb-3" id="todo_item" data-index="${index}">
                <div class="form-check ps-0 d-flex align-items-center">
                    <input class="form-check-input ms-2 me-3 " type="checkbox">
                    <i class="bi bi-check-lg me-3 d-none"></i>
                    <label class="form-check-label mt-1">${item.content}</label>
                </div>
                <i class="bi bi-x-lg"></i>
            </div>
        `;
        } else {
            html_txt += `
            <div class="todo_item d-flex justify-content-between align-items-center mb-3" id="todo_item" data-index="${index}">
                <div class="form-check ps-0 d-flex align-items-center">
                    <input class="form-check-input ms-2 me-3 d-none" type="checkbox">
                    <i class="bi bi-check-lg me-3"></i>
                    <label class="form-check-label mt-1 active">${item.content}</label>
                </div>
                <i class="bi bi-x-lg"></i>
            </div>
        `;
        }
    })

    list_items.innerHTML = html_txt;
    todo_item = document.querySelectorAll('#todo_item')
    item_listener()
}

function check_token() {
    if (sessionStorage.getItem('token')) {
        user_name = sessionStorage.getItem('name')
        header_logout.innerHTML = `
        <h1 class="fw-bolder d-lg-block h5 mb-0 me-3" id="user_account">
        ${user_name} 的待辦</h1>
        <a href="#" class="text-center text-lg-start" id="logout">登出</a>
        `
        logout_btn = document.querySelector('#logout')
    } else {
        header_logout.innerHTML = `
            <a href="./login.html" class="me-3">登入</a>
            <a href="./signup.html" class="text-center text-lg-start" id="logout">註冊</a>
        `
    }
}
function bar_reset() {
    for (const item of all_bar_li) {
        item.classList.remove('active')
    }
}

