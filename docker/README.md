## Running OC Elections API in a Docker Container

You can find a Dockerfile in the ```docker``` directory. Fisrt, build the image:

```
~$ docker build -t {username}/oc-election-api -f docker/Dockerfile .
```

Run it:

```
~$ docker run -p 49160:4000 -d {username}/oc-election-api
```

You can can now access the container at ```http://{docker-ip}:49160```
