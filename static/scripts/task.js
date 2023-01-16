var account = cookie_get ('account');
var code = cookie_get ('code');

function cookie_get (cname) {
    let name = cname + '=';
    let decoded_cookie = decodeURIComponent (document.cookie);
    let ca = decoded_cookie.split (';');
    for (let i = 0; i < ca.length; i ++) {
        let c = ca [i];
        while (c.charAt (0) == ' ') {
            c = c.substring (1);
        }
        if (c.indexOf (name) == 0) {
            return c.substring (name.length, c.length);
        }
    }
    return '';
}

function cookie_post (cname, cvalue) {
    const date = new Date ();
    date.setTime (date.getTime () + 24 * 60 * 60 * 1000);
    let expires = 'expires=' + date.toUTCString ();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function fetch_task_list () {
    fetch ('fetch-task-list/' + account, {method: 'GET', headers: {'Authorisation': code}}).then (res => res.json ()).then (output => {
        if (output.success) {
            var div_container = document.getElementById ('div_container');
            div_container.innerHTML = '<div class = \'nav\'><span class = \'link\' onclick = \'window.location = "dashboard.html"\'>Dashboard</span> &ensp; | &ensp; <span class = \'highlight\'>Task manager</span> &ensp; | &ensp; <span class = \'link\' onclick = \'window.location = "domain.html"\'>Domain manager</span></div>';
            for (i in output.task_list) {
                var domain = output.task_list [i];
                var div = document.createElement ('div');
                div.setAttribute ('class', 'box');
                div.innerHTML = '<span class = \'heading\'>' + domain [1] + '</span><table id = \'table_task_list_' + domain [0] + '\' class = \'task-list\'></table>';
                div_container.appendChild (div);
                var table_task_list = document.getElementById ('table_task_list_' + domain [0]);
                table_task_list.innerHTML = '<tr><th class = \'sl-no\'>SL NO</th><th class = \'description\'>DESCRIPTION</th><th class = \'options\'>OPTIONS</th></tr>';
                for (j in domain [3]) {
                    var task = domain [3] [j];
                    var tr = document.createElement ('tr');
                    var style_string = 'style = \'background-color: ' + domain [2] + ';\'';
                    tr.innerHTML = '<td ' + style_string + '>' + (parseInt (j) + 1) + '</td><td ' + style_string + '>' + task [1] + '</td><td class = \'options\' ' + style_string + ' onclick = \'remove_task (' + task [0] + ')\'>Delete</td>';
                    table_task_list.appendChild (tr);
                }
                var tr = document.createElement ('tr');
                var style_string = 'style = \'background-color: #ffffff;\'';
                tr.innerHTML = '<td ' + style_string + '>' + (parseInt (domain [3].length) + 1) + '</td><td ' + style_string + '><input id = \'input_description_' + domain [0] + '\' class = \'textbox-long\' type = \'text\'></td><td class = \'options\' ' + style_string + ' onclick = \'add_task (' + domain [0] + ')\'>Add</td>';
                table_task_list.appendChild (tr);
            }
        } else {
            window.location = 'home.html';
        }
    })
}

function remove_task (task) {
    var input = {account: account, task: task};
    fetch ('remove-task', {method: 'POST', headers: {'Authorisation': code, 'Content-Type': 'application/json;charset=utf-8'}, body: JSON.stringify (input)}).then (res => res.json ()).then (output => {
        if (output.success) {
            fetch_task_list ();
        } else {
            window.location = 'home.html';
        }
    })
}

function add_task (domain) {
    var description = document.getElementById ('input_description_' + domain).value;
    var input = {account: account, domain: domain, description: description};
    fetch ('add-task', {method: 'POST', headers: {'Authorisation': code, 'Content-Type': 'application/json;charset=utf-8'}, body: JSON.stringify (input)}).then (res => res.json ()).then (output => {
        if (output.success) {
            fetch_task_list ();
        } else {
            window.location = 'home.html';
        }
    })
}

function main () {
    fetch_task_list ();
}

main ();