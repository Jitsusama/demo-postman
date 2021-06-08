## Overview

Postman is a service that facilitates experimentation, documentation and
integration of all things API. This is especially useful when trying to learn a
new API, giving a relatively simple interface to make and record requests.

It allows for adhoc definitions, or importing pre-existing API specifications
in various formats. OpenAPI and WSDL being a couple of examples.

On the experimentation side, it has a unique feature centred around quickly
building mock implementations of an API and making them publicly accessible,
so that you can test an application against the API before it actually exists.

## Initial Setup

Follow these steps in order to set the stage for the rest of the demo.

1. Clone this repository.
1. Run `npm install` followed by `npm start` from the _ui_ directory.
1. Open Postman
1. Home -> Start Something New -> Workspace
1. Set _Name_ to _Demo_ -> Create Workspace
1. APIs -> Create an API -> Import -> GitHub -> Continue
1. Set _Repository_ to _postman-demo_ -> Continue -> Import -> Confirm and Close
1. APIs -> Backend API -> Develop -> Add Mock Server -> Create New Mock Server -> Use an Existing Collection -> Select Collection and Continue
1. Set _Name_ to _Demo_, Check _Save the mock server URL..._ -> Create Mock Server -> Close
1. Environments -> Demo -> Set _Variable_ to _baseUrl_ -> Save

## Documentation Demo

These steps show off a high level overview of Postman's documentation
capabilities.

1. Workspaces -> Demo -> APIs -> Backend API -> Define
1. Develop -> Documentation
1. View Collection -> Collections

## Request Demo

This is an example of how to run requests and see them in action.

1. Workspaces -> Demo -> Collections -> Backend API
1. Change _No Environment_ to _Demo_
1. Backend API -> Login -> Invalid credentials -> Set _password_ to _bad_ -> Save
1. Send Login request with _password_ set to _secret_ and _bad_.
1. Send Retrieve Logins request.
1. Console and observe entries.
1. History and observe entries.

## Mock Demo

Finally, here is a live example of an application speaking to a mocked out API.

1. Workspaces -> Demo -> Mock Servers -> Demo -> Copy URL
1. Go to UI -> Paste URL
1. Set _Username_ to _john_ and password to _secret_ -> Login
1. Logout -> Set _Username_ to _john_ and password to _bad_ -> Login
1. Go to Postman -> Mock Servers -> Demo
1. Observe entries.
