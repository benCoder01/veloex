# Kommunikationsstruktur

POST /register
```
{
    "username":
    "surname":
    "name":
    "email"
    "password":
    "driver":
    "address": {
        "nomen":
        "street":
        "number":
        "zip":
        "city":
    }
}
```

```
{
    "username":
}
```

POST /login
```
{
    "username":
    "password":
}
```

```
{
    "token":
    "username" 
}
```


POST /customer/{username}/send
```
{
    "size": {
        "length":
        "depth":
        "height"
        "weight"
    },
    "distination":
    "origin":
    "pickUpTime": {
        "from":
        "to":
    }
}
```

```
{
    "packetID": 
}
```

POST /driver/delivered

```
{
    "username":
    "packetID":
}
```

```
{
    "packetID":
}
```

POST /driver/{username}/accept/{packetID}

```
```

```
{
    "size": {
        "length":
        "depth":
        "height"
        "weight"
    },
    "distination":
    "origin":
    "pickUpTime": {
        "from":
        "to":
    },
}
```


GET /packet/{id}

```
{
    "size": {
        "length":
        "depth":
        "height"
        "weight"
    },
    "distination":
    "origin":
    "pickUpTime": {
        "from":
        "to":
    }
}
```




# Examples

## Register
```json
{
	"username": "benedikt",
	"name": "Benedikt Ricken",
	"email": "benedikt-ricken@gmx.de",
	"password": "11234",
	"driver": true,
	"address": {
		"nomen": "Benedikt Ricken",
		"street": "Kreuzberegweg",
		"number": "18",
		"zip": "53115",
		"city": "Bonn"
		
	}
}
```