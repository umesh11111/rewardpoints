from pyngrok import ngrok
import time

ngrok.set_auth_token("3AO269koMWSJ1iypM1kJUNJG4Ke_3AFg2eTYhRp3JYMJb9XaB")
http_tunnel = ngrok.connect(3000)
print (http_tunnel.public_url)
time.sleep(30000)