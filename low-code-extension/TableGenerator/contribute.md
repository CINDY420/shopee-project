## 1. Related Urls
GitRepo: https://git.garena.com/shopee/sz-devops/fe/infra-base/vscode-infra  
Issues Board: https://git.garena.com/shopee/sz-devops/fe/infra-base/vscode-infra/-/boards  
Confluence Pages: https://confluence.shopee.io/x/fTCDPw  
Install from VSCode Extension Market: https://marketplace.visualstudio.com/items?itemName=vscode-infra.vscode-infra  

## 2. File an issue  
If you find a bug or want to submit a new requirement, you can file a new issue at: https://git.garena.com/shopee/sz-devops/fe/infra-base/vscode-infra/-/issues/new  
Remember to add label `Issues::Bug` or `Issues::FeatureRequest`.  

## 3. Participate in the development  
- Ask for permission to git repo if you don't have it  
- Join Seatalk group "Vscode Infra Developers" to participate in discussions and get notifications  
- Contact zhangjian@shopee.com with any questions  

### 3.1 Required skills  
Common skills:  Nodejs, Reactjs, StyledComponent, TypeScript, Ant Design UI  
VSCode Extension API: (https://code.visualstudio.com/api/extension-guides/overview)  

### 3.2 How to take a task
Find an issue with a "To do" tag that interests you at the issues board, then change it to "Doing".  

## 4. Development Guide

### 4.1 Debug and develop
// clone to local  
`git clone gitlab@git.garena.com:shopee/sz-devops/fe/infra-base/vscode-infra.git`  
// install packages  
`yarn`  
// change directory to the embedded webview UI project, then install packages and build a dist.  
`cd src/webviewUI && yarn && yarn build`  
Now you can press F5 to debug the extension in a new popup VSCode instance.  

### 4.2 Publish
You need to register an account at: https://marketplace.visualstudio.com/  
// install vsce  
`sudo npm install -g vsce`  
// build a local install file  
`vsce package`  
// publish patch[minor|major] version  
`vsce publish patch`  






