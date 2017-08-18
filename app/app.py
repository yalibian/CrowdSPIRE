import json
import operator
import random
from flask import Flask
from os import listdir
from os.path import isfile, join


# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')


@app.route('/')
def root():
    return app.send_static_file('spire/index.html')


@app.route('/crowd')
def crowd():
    return app.send_static_file('/crowd/index.html')


# about
@app.route('/about', methods=['GET', 'POST'])
def details():
    return ''' 
    <h1>CrowdSPIRE: crowdsourcing based visual analytics system. </h1>
    <h1>BY: Yali Bian (Department of Computer Science, Virginia Tech)</h1>
    '''

app.run(debug=True)
