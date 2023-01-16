from flask import Flask, jsonify, request, send_from_directory
import mysql.connector, random, time

app = Flask (__name__, static_url_path = '')
sql_password = 'password'
epoch = 1672617600

@app.route ('/static/add-domain', methods = ['POST'])

def add_domain ():
    data = request.json
    if not authenticate (data ['account'], request.headers ['Authorisation']):
        output = {'success': False}
    else:
        color = int (random.random () * len (sql_get ('select id from color_list'))) + 1
        sql_post ('insert into domain_list set account = ' + str (data ['account']) + ', title = \'' + data ['title'] + '\', color = ' + str (color) + ', active = true')
        output = {'success': True}
    return jsonify (output)

@app.route ('/static/add-slot', methods = ['POST'])

def add_slot ():
    data = request.json
    if not authenticate (data ['account'], request.headers ['Authorisation']):
        output = {'success': False}
    else:
        existing = sql_get ('select id from slot_list where account = ' + str (data ['account']) + ' and slot = ' + str (data ['slot']) + ' and active = true')
        if len (existing) > 0:
            sql_post ('update slot_list set domain = ' + str (data ['domain']) + ' where id = ' + str (exiting [0] [0]))
        else:
            sql_post ('insert into slot_list set account = ' + str (data ['account']) + ', slot = ' + str (data ['slot']) + ', domain = ' + str (data ['domain']) + ', active = true')
        output = {'success': True}
    return jsonify (output)

@app.route ('/static/add-task', methods = ['POST'])

def add_task ():
    data = request.json
    if not authenticate (data ['account'], request.headers ['Authorisation']):
        output = {'success': False}
    else:
        sql_post ('insert into task_list set domain = ' + str (data ['domain']) + ', description = \'' + data ['description'] + '\', active = true')
        output = {'success': True}
    return jsonify (output)

@app.route ('/static/fetch-domain-list/<account>', methods = ['GET'])

def fetch_domain_list (account):
    if not authenticate (account, request.headers ['Authorisation']):
        output = {'success': False, 'task_list': tuple ()}
    else:
        domain_list = sql_get ('select id, title, color from domain_list where account = ' + str (account) + ' and active = true')
        for index in range (len (domain_list)):
            value = sql_get ('select value from color_list where id = ' + str (domain_list [index] [2])) [0] [0]
            domain_list [index] = (domain_list [index] [0], domain_list [index] [1], value)
        output = {'success': True, 'domain_list': tuple (domain_list)}
    return jsonify (output)

@app.route ('/static/fetch-slot/<account>/<slot>', methods = ['GET'])

def fetch_slot (account, slot):
    if not authenticate (account, request.headers ['Authorisation']):
        output = {'success': False, 'task_list': tuple ()}
    else:
        response = sql_get ('select domain from slot_list where id = ' + slot + '')
        if len (response) > 0:
            domain = response [0] [0]
            task_list = list (sql_get ('select description from task_list where domain = ' + str (domain) + ' and active = true'))
            for index in range (len (task_list)):
                task_list [index] = task_list [index] [0]
        else:
            task_list = list ()
        output = {'success': True, 'slot': slot, 'task_list': tuple (task_list)}
    return jsonify (output)

@app.route ('/static/fetch-task-list/<account>', methods = ['GET'])

def fetch_task_list (account):
    if not authenticate (account, request.headers ['Authorisation']):
        output = {'success': False, 'task_list': tuple ()}
    else:
        mega_list = sql_get ('select id, title, color from domain_list where account = ' + str (account) + ' and active = true')
        for index in range (len (mega_list)):
            value = sql_get ('select value from color_list where id = ' + str (mega_list [index] [2])) [0] [0]
            task_list = sql_get ('select id, description from task_list where domain = ' + str (mega_list [index] [0]) + ' and active = true')
            mega_list [index] = (mega_list [index] [0], mega_list [index] [1], value, task_list)
        output = {'success': True, 'task_list': tuple (mega_list)}
    return jsonify (output)

@app.route ('/static/fetch-timetable/<account>', methods = ['GET'])

def fetch_timetable (account):
    if not authenticate (account, request.headers ['Authorisation']):
        output = {'success': False, 'timetable': tuple ()}
    else:
        slot_list = sql_get ('select id, slot, domain from slot_list where account = ' + str (account) + ' and active = true')
        timetable = []
        for index in range (168):
            timetable.append ((0, index + 1, '', '#ffffff'))
        for slot in slot_list:
            title, color = sql_get ('select title, color from domain_list where id = ' + str (slot [2]) + ' and active = true') [0]
            value = sql_get ('select value from color_list where id = ' + str (color)) [0] [0]
            timetable [slot [1] - 1] = (slot [0], slot [1], title, value)
        output = {'success': True, 'timetable': tuple (timetable)}
    return jsonify (output)

@app.route ('/static/remove-domain', methods = ['POST'])

def remove_domain ():
    data = request.json
    if not authenticate (data ['account'], request.headers ['Authorisation']):
        output = {'success': False}
    else:
        sql_post ('update domain_list set active = false where id = ' + str (data ['domain']))
        sql_post ('update slot_list set active = false where domain = ' + str (data ['domain']))
        sql_post ('update task_list set active = false where domain = ' + str (data ['domain']))
        output = {'success': True}
    return jsonify (output)

@app.route ('/static/remove-slot', methods = ['POST'])

def remove_slot ():
    data = request.json
    if not authenticate (data ['account'], request.headers ['Authorisation']):
        output = {'success': False}
    else:
        sql_post ('update slot_list set active = false where id = ' + str (data ['slot']))
        output = {'success': True}
    return jsonify (output)

@app.route ('/static/remove-task', methods = ['POST'])

def remove_task ():
    data = request.json
    if not authenticate (data ['account'], request.headers ['Authorisation']):
        output = {'success': False}
    else:
        sql_post ('update task_list set active = false where id = ' + str (data ['task']))
        output = {'success': True}
    return jsonify (output)

@app.route ('/static/sign-in/<username>/<password>', methods = ['GET'])

def sign_in (username, password):
    account_list = sql_get ('select id from account_list where username = \'' + username + '\' and password = \'' + password + '\'')
    output = {'success': False, 'message': '', 'account': 0, 'code': ''}
    if len (account_list) == 0:
        output = {'success': False, 'message': 'Either the username or the password is invalid', 'account': 0, 'code': ''}
    else:
        code = ''
        for index in range (10):
            code += chr (97 + int (random.random () * 26))
        stamp = int ((time.time () - epoch) / 60) + 1
        sql_post ('delete from session_list where account = ' + str (account_list [0] [0]))
        sql_post ('insert into session_list set account = ' + str (account_list [0] [0]) + ', code = \'' + code + '\', last_active = ' + str (stamp))
        output = {'success': True, 'message': '', 'account': account_list [0] [0], 'code': code}
    return jsonify (output)

@app.route ('/static/sign-up', methods = ['POST'])

def sign_up ():
    data = request.json
    username_regex = True
    for char in data ['username']:
        if (not char.isalpha) and (not char.isdigit ()) and char != '_':
            username_regex = False
    username_regex = username_regex and (len (data ['username']) >= 5) and (len (data ['username']) <= 20)
    username_taken = len (sql_get ('select id from account_list where username = \'' + data ['username'] + '\'')) > 0
    output = {'success': False, 'message': ''}
    if data ['username'] == '' or data ['password'] == '' or data ['password_re'] == '':
        output = {'success': False, 'message': 'Please fill all the fields before submitting'}
    if not username_regex:
        output = {'success': False, 'message': 'The username must be 5-20 characters long and must only contain letters, numeric digits and underscores'}
    elif username_taken:
        output = {'success': False, 'message': 'The username ' + data ['username'] + ' has already been taken'}
    elif len (data ['password']) > 30:
        output = {'success': False, 'message': 'The password must not exceed 30 characters'}
    elif data ['password'] != data ['password_re']:
        output = {'success': False, 'message': 'The re-entered password does not match the original'}
    else:
        sql_post ('insert into account_list set username = \'' + data ['username'] + '\', password = \'' + data ['password'] + '\'')
        output = {'success': True, 'message': ''}
    return jsonify (output)

@app.route ('/static/slot-conversion/<account>/<num>', methods = ['GET'])

def slot_conversion (account, num):
    if not authenticate (account, request.headers ['Authorisation']):
        output = {'success': False, 'slot': 0}
    else:
        response = sql_get ('select id from slot_list where account = ' + str (account) + ' and slot = ' + str (num) + ' and active = true')
        slot = 0
        if len (response) > 0:
            slot = response [0] [0]
        output = {'success': True, 'slot': slot}
    return jsonify (output)

@app.route ('/static/<path:path>', methods = ['GET'])

def connector (path):
    return send_from_directory ('static', path)

def authenticate (account, code):
    stamp = int ((time.time () - epoch) / 60) + 1
    valid = len (sql_get ('select account from session_list where account = ' + str (account) + ' and code = \'' + code + '\' and last_active > ' + str (stamp - 60))) > 0
    if valid:
        sql_post ('update session_list set last_active = ' + str (stamp) + ' where account = ' + str (account) + ' and code = \'' + code + '\'')
    return valid

def sql_get (command):
    database = mysql.connector.connect (host = 'localhost', user = 'root', passwd = sql_password, database = 'planner')
    cursor = database.cursor ()
    cursor.execute (command)
    return cursor.fetchall ()

def sql_post (command):
    database = mysql.connector.connect (host = 'localhost', user = 'root', passwd = sql_password, database = 'planner')
    cursor = database.cursor ()
    cursor.execute (command)
    database.commit ()

if (__name__ == '__main__'):
    app.run (debug = True, host = '0.0.0.0', port = 3000)