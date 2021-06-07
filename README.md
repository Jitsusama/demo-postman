This repository serves as the foundation for a Postman demo.

## Initial Setup

1. Clone this repository.
1. Run `npm install` followed by `npm start` from the _ui_ directory.
1. Open Postman
1. Home -> Start Something New -> Workspace
1. Set _Name_ to _demo_ -> Create Workspace
1. APIs -> Create an API -> Import -> GitHub -> Continue
1. Set _Repository_ to _postman-demo_ -> Continue -> Import -> Confirm and Close
1. APIs -> Backend API -> Develop -> Add Mock Server -> Create New Mock Server -> Use an Existing Collection -> Select Collection and Continue
1. Set _Name_ to _demo_, Check _Save the mock server URL..._ -> Create Mock Server
1. Environments -> Demo -> Set _Variable_ to _baseUrl_ -> Save
   
## Mock Demo

1. Workspaces -> Demo -> Mock Servers -> Demo -> Copy URL
1. Paste URL into Website
1. Set _Username_ to _john_ and password to _secret_ -> Login
1. Logout -> Set _Username_ to _john_ and password to _bad_ -> Login

## Documentation Demo

1. Workspaces -> Demo -> APIs -> Backend API -> Define
1. Develop -> Documentation
1. View Collection -> Collections

## Request Demo

1. Workspaces -> Demo -> Collections -> Backend API
1. Change _No Environment_ to _Demo_
1. Backend API -> Login -> Invalid credentials -> Set _password_ to _bad_ -> Save
1. Send Login request with _password_ set to _secret_ and _bad_.
1. Send Retrieve Logins request.
1. History and observe entries
