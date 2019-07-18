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

`/register`

```json
{
	"username": "benedikt",
	"name": "Benedikt Ricken",
	"email": "example@example.de",
	"password": "11234",
	"driver": true,
	"address": {
		"nomen": "Max Mustermann",
		"street": "Musterstraße",
		"number": "18",
		"zip": "11111",
		"city": "Musterstadt"
		
	}
}
```

## Login

`/login`

```json
{
	"username": "benedikt3",
	"password": "11234"
}
```

## Send package

`/customer/benedikt3/send`

```json
{
	"size": {
		"length": 0,
		"depth": 0,
		"height": 0
	},
	"weight": 0,
	"destination": "1234555",
	"origin": "12342323",
	"pickUpTime": {
		"from": "12:30",
		"to": "13:00"
	}
}
```

## Accept Package
`/driver/benedikt3/accept/2`

## Deliver Package

`/driver/delivered`

```json
{
	"username": "benedikt3",
	"packetID": 25
}
```

## Status available

`/status/benedikt3/available`

## Status not available

`/status/benedikt3/notavailable`
