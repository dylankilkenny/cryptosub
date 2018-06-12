import time

def log(message, newline = None, returnline = None):
    t = time.strftime("%Y-%m-%d %H:%M:%S")    
    if newline and returnline:
        print("\n[{0}] {1}".format(t, message), end="\r")
    elif newline:
        print("\n[{0}] {1}".format(t, message))
    elif returnline:
        print("[{0}] {1}".format(t, message), end="\r")        
    else:
        print("[{0}] {1}".format(t, message))
        
