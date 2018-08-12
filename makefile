install:
	export ENV=dev;cd analysis; python3 setup.py; pip3 install -r requirements.txt
	cd webapp; npm install
	cd server; npm install
