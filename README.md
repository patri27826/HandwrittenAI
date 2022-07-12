``` bash
# install front-end
cd frontend
npm install

# install back-end
cd ../backend
virtualenv -p python3 venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# serve back-end at localhost:5000
FLASK_APP=run.py flask run
```

# build for production/Flask with minification
npm run build


