from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask import Flask, render_template, jsonify
from flask import request
from random import *
from flask_cors import CORS
import requests,base64,uuid
import os


app = Flask(__name__, static_folder = "./dist/static", template_folder = "./dist")
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///test.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    content = db.Column(db.Text)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"


#login
@app.route('/api/login',methods=['GET', 'POST'])
def login():
    username = request.args.get('username')
    password = request.args.get('password')
    query = User.query.filter_by(username=username).first()
    if query == None:
        return "fail"
    else:
        return "success"


#register
@app.route('/api/register',methods=['GET', 'POST'])
def register():
    username = request.args.get('username')
    password = request.args.get('password')
    query = User.query.filter_by(username=username).first()
    if query != None:
        return "fail"
    else:
        user_1 = User(username = username, password = password, content = None)
        db.session.add(user_1)
        db.session.commit()
        return "success"


#save JPEG
@app.route('/api/getdata',methods=['GET', 'POST']) 
def getJpeg():
    data = request.args.get('data')
    username = request.args.get('username')
    count = request.args.get('count')
    # define('UPLOAD_DIR', 'images/');
    data = data.replace('data:image/jpeg;base64,', '')
    data = data.replace(' ', '+')
    data = base64.b64decode(data)
    path = './frontend/image/'+username+'/'
    if not os.path.exists(path):
        os.makedirs(path)
    file = path+count+'.jpeg'
    file1 = open(file,"wb+") #write mode 
    file1.write(data)
    file1.close() 

    #database
    path = username+'/'+count+'.jpeg'  #update path for frontend
    query = User.query.filter_by(username=username).first()
    if query.content != None:
        query.content = query.content+","+path
    else:
        query.content = path
    db.session.commit()
    return "Save Success !"

#send word list
@app.route('/api/sendword',methods=['GET', 'POST'])
def sendWord():
    file = open('word_list.txt',"r",encoding="utf-8")
    list_1 = file.readlines()
    return jsonify({'list': list_1})


#send picture path
@app.route('/api/getpic',methods=['GET', 'POST'])
def getPic():
    username = request.args.get('username')
    query = User.query.filter_by(username=username).first()
    return query.content

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    # if app.debug:
    #     return requests.get('http://localhost:8080/{}'.format(path)).text
    return render_template("index.html")


# if __name__ == '__main__':
    
