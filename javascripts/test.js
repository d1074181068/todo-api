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