const APIurl = 'https://todoo.5xcamp.us'
// let userToken = '';
let todo_all = [];

function login(email, password) {
    console.log('登入中請稍後 ...');
    setTimeout(() => {
        axios.post(`${APIurl}/users/sign_in`,
            {
                "user": {
                    "email": email,
                    "password": password
                }
            }
        )
            .then(res => {
                axios.defaults.headers.common['Authorization'] = res.headers.authorization;
                console.log(`登入成功`);
                console.log(`歡迎 ${res.data.nickname} 回來`);
            })
            .catch(error => {
                console.log(error.response);
            })
    }, 1000);
}

function get_todo() {
    todo_all.splice(0, todo_all.length)
    axios.get(`${APIurl}/todos`)
        .then(
            res => {
                console.log(res.data.todos);
                res.data.todos.forEach(item => {
                    todo_all.push(item)
                });
            }
        ).catch(
            error => {
                console.log(error);
            }
        )
}

function add_todo(content) {
    axios.post(`${APIurl}/todos`, {
        "todo": {
            "content": content
        }
    })
        .then(
            res => {
                console.log(res);
            }
        ).catch(
            error => {
                console.log(error);
            }
        )
}

function update_todo(dataindex, content) {
    console.log('資料修改中 ... ');
    setTimeout(() => {
        axios.put(`${APIurl}/todos/${todo_all[dataindex - 1].id}`,
            {
                "todo": {
                    "content": content
                }
            })
            .then(
                res => {
                    console.log(res);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
    }, 1500);
}

function del_todo(dataindex) {
    console.log('資料刪除中 ... ');
    setTimeout(() => {
        axios.delete(`${APIurl}/todos/${todo_all[dataindex - 1].id}`)
            .then(
                res => {
                    console.log(res);
                    console.log(`第${dataindex}筆待辦 已刪除`);
                }
            ).catch(
                error => {
                    console.log(error.response);
                }
            )
    }, 1500);

}

function todo_status(dataindex) {
    axios.patch(`${APIurl}/todos/${todo_all[dataindex].id}/toggle`, {})
        .then(
            res => {
                console.log(res);
            }
        ).catch(
            error => {
                console.log(error.response);
            }
        )
}

login('string@gmail.com', 'string123')

setTimeout(() => {
    get_todo()
}, 2500);



// const input = async (mail, pwd) => {
//     try {
//         const data = await login(mail, pwd);
//         console.log(data);
//     } catch (error) {

//     }
// }


// input('string@gmail.com', 'string13')
