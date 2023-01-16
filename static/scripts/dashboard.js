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

function load_timetable () {
    fetch ('fetch-timetable/' + account, {method: 'GET', headers: {'Authorisation': code}}).then (res => res.json ()).then (output => {
        if (output.success) {
            var table = document.getElementById ('table');
            table.innerHTML = '<tr><th>TIME</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th><th>SUN</th></tr>';
            var i = 0;
            while (i < 24) {
                var tr = document.createElement ('tr');
                var time = '';
                if (i == 0) {
                    time = '0000';
                } else if (i < 10) {
                    time = '0' + i + '00'
                } else {
                    time = i + '00'
                }
                tr.innerHTML = '<td class = \'time\'>' + time + '</td>';
                var j = 0;
                while (j < 7) {
                    var cell = output.timetable [i + j * 24];
                    tr.innerHTML += '<td onclick = \'view_slot (' + cell [1] + ')\' style = \'background-color: ' + cell [3] + '; cursor: pointer;\'>' + cell [2] + '</td>';
                    j ++;
                }
                table.appendChild (tr);
                i ++;
            }
        } else {
            window.location = 'home.html';
        }
    })
}

function view_slot (slot) {
    fetch ('slot-conversion/' + account + '/' + slot, {method: 'GET', headers: {'Authorisation': code}}).then (res => res.json ()).then (output => {
        if (output.success) {
            var epoch = 1672597800;
            var week = Math.floor ((Date.now () / 1000 - epoch) / (7 * 24 * 60 * 60));
            var date = new Date ((epoch + week * (7 * 24 * 60 * 60) + (slot - 1) * (60 * 60)) * 1000);
            var hour = date.getHours ();
            var time = '';
            if (hour == 0) {
                time = '0000';
            } else if (hour < 10) {
                time = '0' + hour + '00';
            } else {
                time = hour + '00';
            }
            var span_slot_title = document.getElementById ('span_slot_title');
            span_slot_title.innerHTML = date.getDate () + ' | ' + (date.getMonth () + 1) + ' | ' + date.getFullYear () + ' - ' + time;
            var span_caption = document.getElementById ('span_caption');
            span_caption.innerHTML = '';
            var span_domain_list = document.getElementById ('span_domain_list');
            span_domain_list.innerHTML = '';
            var ol_task_list = document.getElementById ('ol_task_list');
            ol_task_list.innerHTML = '';
            var span_delete_button = document.getElementById ('span_delete_button');
            span_delete_button.innerHTML = '';
            if (output.slot == 0) {
                fetch ('fetch-domain-list/' + account, {method: 'GET', headers: {'Authorisation': code}}).then (res => res.json ()).then (output => {
                    if (output.success) {
                        span_caption.innerHTML = 'Add slot';
                        for (index in output.domain_list) {
                            var domain = output.domain_list [index];
                            span_domain_list.innerHTML += '<button onclick = \'add_slot (' + slot + ', ' + domain [0] + ')\'>' + domain [1].toUpperCase () + '</button>';
                        }
                    } else {
                        window.location = 'home.html';
                    }
                })
            } else {
                fetch ('fetch-slot/' + account + '/' + output.slot, {method: 'GET', headers: {'Authorisation': code}}).then (res => res.json ()).then (output => {
                    if (output.success) {
                        span_caption.innerHTML = 'Tasks';
                        for (index in output.task_list) {
                            ol_task_list.innerHTML += '<li>' + output.task_list [index] + '</li>';
                        }
                        span_delete_button.innerHTML = '<button onclick = \'remove_slot (' + output.slot + ')\'>DELETE</button>';
                    } else {
                        window.location = 'home.html';
                    }
                })
            }
        } else {
            window.location = 'home.html';
        }
    })
}

function add_slot (slot, domain) {
    var input = {account: account, slot: slot, domain: domain};
    fetch ('add-slot', {method: 'POST', headers: {'Authorisation': code, 'Content-Type': 'application/json;charset=utf-8'}, body: JSON.stringify (input)}).then (res => res.json ()).then (output => {
        if (output.success) {
            load_timetable ();
        } else {
            window.location = 'home.html';
        }
    })
}

function remove_slot (slot) {
    var input = {account: account, slot: slot};
    fetch ('remove-slot', {method: 'POST', headers: {'Authorisation': code, 'Content-Type': 'application/json;charset=utf-8'}, body: JSON.stringify (input)}).then (res => res.json ()).then (output => {
        if (output.success) {
            load_timetable ();
        } else {
            window.location = 'home.html';
        }
    })
}

function main () {
    load_timetable ();
    var epoch = 1672597800;
    var week = Math.floor ((Date.now () / 1000 - epoch) / (7 * 24 * 60 * 60));
    var slot = Math.floor ((Date.now () / 1000 - (epoch + week * (7 * 24 * 60 * 60))) / (60 * 60)) + 1;
    setTimeout (view_slot, 500, slot);
}

main ();