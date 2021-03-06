# User interface
##  登陆页面  
form:登陆名（邮箱）  密码  
##  注册页面  
form:用户名（昵称） 登录名（邮箱） 密码

## error code:
### （登陆）
a1:账号或密码错误  
### （注册）
b1:账号已经注册  

## 调试
debug-fake-backend 是调试用的伪后端，flask写的，模拟后端接受post做客户验证并返回信息，前端可以根据自己的需要来定制自己的url响应内容，注意不要冲突，当前有的登陆和注册的url  
  
eg:  
在登陆不成功的时候返回  
```
{'error','a1'}
```


## 所用到的轮子
D3.js  v3  
material.min.css    v1.1.3  
materialize         0.97.7  
jquery              v2.1.1


# 接口文档
### plugin:user_module  
用户模型-属性  
face:base64    
name:str    
email:str(key)  
education:str  
major:str  
description:str  

用户模型-url post

### abstract
关于用户退登陆的接口在user.js里面，  
logout_form()向服务器发出退出登陆的请求并在前端重定向到login界面,  
get_user_info()向服务器请求用户数据，用于侧边栏的头像和id的展示。

### 登陆
location : login-1.html  
POST : /plugin/  
data : JSON.parse("{"plugin":"user_model","action":"create_user","email":"sam@gmail.com","password":"123456","username":"Big Sam"}")  
如果成功 ：跳转到home页面  
如果失败 ：后端返回错误原因 弹出提示信息  


 
### 修改头像
location : profile_edit.html  
POST : /plugin/  
data : JSON.parse("[{"plugin":"user_model"},{"action":"head_change"},{"data":"data:image/png;base64,iVBORw0KGg..........mCPQ73/mO/e63v/CC"}]")  
如果成功 ：弹出提示修改成功的信息   
如果失败 ：弹出提示修改失败的信息  
  
  
### 退出登陆
location : anywhere  
POST : /plugin/  
data : JSON.parse("{"plugin":"user_model","action":"logout"}")  
重定向到login页面


### 注册  
location : signup.html  
POST : /plugin/  
data :  JSON.parse("{"plugin":"user_model","action":"create_user","email":"sam@gmail.com","password":"123456","username":"uncle sam"}")   
如果注册成功，跳转到注册页面
如果注册失败，后端返回错误原因，弹出提示信息


### 获取用户信息
location : anywhere  
POST : /plugin/  
data : JSON.parse("{"plugin":"user_model","action":"get_user_data")  
res :   
    email *(string)   
    username *(string)    
    avatar  (string(base64))   
    description (long string)  
    education (long string)  
    major (long string)  
    
如果成功，没有提示  
如果失败，后端返回错误原因，弹出提示信息  

      
### 修改用户信息
location : profile_edit.html
POST : /plugin/  
data : JSON.parse("{"plugin":"user_model","action":"edit_profile","username":"sam J","education":"ustc","major":"hook","description":"nothing"}")    
如果成功，返回home界面  
失败 ： 登录信息过期之类的（返回login-1）  
用于把各种数据分发到各个位置

## BLAST

### data example 
前端向后端提供一段基因序列例如：      
agagaatataaaaagccagattattaatccggcttttttattattt  
后端经过BLAST得到处理结果示例如下  

``` javascript
{"q_length":46,"blast_result":[{'index':0,'ID':'gi|688010384|gb|KM018299.1|',
'description':'Synthetic fluorescent protein expression cassette cat-J23101-mTagBFP2, complete sequence',
    'E-value':7.8e-14,
    'score':84.24,
    'span':46,
    'query_start':0,
    'query_end':46,
'hit_start':21,
'hit_end':67
},
{'index':0,'ID':'gi|688010384|gb|KM018299.1|',
    'description':'Synthetic fluorescent protein expression cassette cat-J23101-mTagBFP2, complete sequence',
    'E-value':7.8e-14,
    'score':84.24,
    'span':46,
    'query_start':0,
    'query_end':46,
    'hit_start':21,
    'hit_end':67,
},{'index':0,'ID':'gi|688010384|gb|KM018299.1|',
    'description':'Synthetic fluorescent protein expression cassette cat-J23101-mTagBFP2, complete sequence',
    'E-value':7.8e-14,
    'score':84.24,
    'span':46,
    'query_start':0,
    'query_end':46,
    'hit_start':21,
    'hit_end':67,
},{'index':0,'ID':'gi|688010384|gb|KM018299.1|',
    'description':'Synthetic fluorescent protein expression cassette cat-J23101-mTagBFP2, complete sequence',
    'E-value':7.8e-14,
    'score':84.24,
    'span':46,
    'query_start':0,
    'query_end':46,
    'hit_start':21,
    'hit_end':67
}]};
```

## simulation

#### upload data example:  
location : profile_edit.html  
POST : /plugin/    
plugin : simulation  
action : run_sim  
data :
``` javascript
[
{
    "index":0,//index of equation starts from 0
    "name_dydx":"dy0dx" //name of equation (not important)
    "function":"0.05*y[1]+0.0005*y[1]" //function important
    "initial_value":0.1
},
{
    "index":1,//index of equation starts from 0
    "name_dydx":"dy1dx" //name of equation (not important)
    "function":"0.05*y[1]+0.0005*y[1]" //function important
    "initial_value":0.1
},
{
    "index":2,//index of equation starts from 0
    "name_dydx":"dy2dx" //name of equation (not important)
    "function":"0.05*y[1]+0.0005*y[1]" //function important
    "initial_value":0.1
}

```


response : 
``` javascript

{
   "index":0,//corespond to the query index
    "t"   :[2.1,2.2,2.3,......]
    "data":[2,3,4,.......]//calculate result
}
```




http://localhost:5000/plugin/?plugin=biobrick_manager&action=search&key=abc





