# React Version Tracker

This module will be used to detect the version change of application

Version tracking can we done 

## What?
- React version tracker library is used to track app version and inform the 
user.
- It has two type of control  
  - using hooks  
  - using component VersionTracker


## Authors

- [@maniyedidi](https://github.com/maniyedidi)


## Installation

Install eact-version-tracker with npm

```bash
  npm install react-version-tracker  
```

Install eact-version-tracker with yarn

```bash
  yarn add react-version-tracker  
```
    
### How to use  VersionTracker component  

import Component in app level 

```js
import { VersionTracker } from 'react-version-tracker';
```
in app.js add the below code 

```js
<VersionTracker 
  currentVersion='v1.0.0'
  versionFileUrl='version.json'  
  onVersionChange={onVersionChange}
  />
```

### PROPTYPES
| Prop | Type | Default | Description |  
| ---- | ---- | ------- |  ------- | 
| currentVersion | String |  | This will be current version of build |
| versionFileUrl | String | /version.json | this can be file location or any api 
| displayAlert | Boolean | false| when there is change alert will be displayed
| onVersionChange | Function |  | when version change method will be called 
| message | String |  | user message on alert box.

Example 

### versionFileUrl

```
when we keept version file in web server simple pass the file name 
versionFileUrl="version.json". 
or
versionFileUrl="http://text.com/api/get-version"
```

### version.json or api response should be as below.
{
 "version":"1.0.0"
}

### onVersionChange

this funtion will return object {"version":"1.0.0"} 


## how to use version hooks (useVersionTracker and useVersion)
react-version-tracker has two hooks useVersionTracker and useVersion . we have two do 
client and server side changes to use this 

### Client side changes
 we need to pass response of api to useVersionTracker . it has two params first is response 
 second one is key of response header. useVersionTracker hook can be added axios response
interceptor  or any http service.

Sample 1 

```js
import { useVersionTracker } from 'react-version-tracker';

fetch(url, {
      method: method,
      body: JSON.stringify(data),
      headers: headers,
      params: params,
    }).then((response) => {      
      useVersionTracker(response, 'X-Version');     
      return response.json();
    })
```

Sample 2

```js
import axios from 'axios'
import { useVersionTracker } from 'react-version-tracker';

axios.interceptors.response.use(
  response => {
     useVersionTracker(response, 'x-version') 
    return response
  },function (error) {       
      return Promise.reject(error)
    })
```

When any version change detected new version will be returned by useVersion 
```
const { version } = useVersion();

  useEffect(() => {
    if (version !== currentVersion) {
      // write your logic here
    }
  }, [version]);
```


### Server side changes

Node JS Express changes add to the route level

```js
response.header('Access-Control-Expose-Headers', 'x-version');
response.set('x-version', '1.0.0');
```



## Roadmap

- Display modal instead of alert 

- Give option to auto reload in  VersionTracker

- Add auto reload and Display alert option in useVersionTracker 


## 🔗 Links
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/manikanta-yedidi-70586b135/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/ManikantaYedidi)

