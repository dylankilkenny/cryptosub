install:
	export ENV=dev;cd analysis; mv config.example.conf config.conf; python3 setup.py; pip3 install -r requirements.txt
	cd webapp; mv api.example.json api.json; npm install
	cd server; mv origins.example.json origins.json; npm install
