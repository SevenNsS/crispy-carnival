let http=require('http');//导入http模块
let mysql=require('mysql');//导入mysql模块

//注册，链接数据库
http.createServer(function(req,res){
    res.setHeader("Access-Control-Allow-Origin","*");
    let data='';
    console.log('接收到注册请求');
    //接收数据
    req.on('data',function(chunk){
        data+=chunk;
    });
    //接受完毕
    req.on('end',function(){
        // console.log('数据接收完毕:',data);
        //username=jay&age=22&addr=newyork
        var arr=data.split('&');
        let UserID, UserName,Password;//保存前端传递来的数据
        arr.forEach(function(item){
            let arr0=item.split('=');
            if(arr0[0]=='UserID'){
                UserID=arr0[1];
            }else if(arr0[0]=='UserName'){
                UserName=arr0[1];
            }else if(arr0[0]=='Password'){
                Password=arr0[1];
            }
        });
        console.log(UserID,UserName,Password);
        //将数据存入数据库
        saveData(UserID, UserName,Password,function(msg){
            res.write(JSON.stringify(msg));
            res.end();
        });
    });

    // res.write('hello world');
    // res.end();
}).listen(9022);//监听端口号9008


console.log('服务器启动.......');

//将数据存入数据库
function saveData(UserID,UserName, Password,fn){
    //1.创建链接
    let conn=mysql.createConnection({
        host:'localhost',             //主机名
        user:"root",                  //数据库账户名
        password:"XXY09119902",              //数据库密码
        database:"anime"              //要连接的数据名称
    });
    //2.建立链接
    conn.connect();

    // let sql="SELECT * FROM student;";;
    let sql=`insert into 用户信息表 ( UserID, UserName,Password) values ('${UserID}','${UserName}','${Password}');`;
    //3.操作 (增/删/改/查)insert into 用户信息表 (UserID, Password) values ('${UserID}','${Password}');`
    //参数一：sql语句  参数二:回调函数
    conn.query(sql,function(err,result){
        if(!err){
            console.log('数据库访问成功：',result);
            fn({code:200,msg:"注册成功"});
        }else{
            console.log('数据库访问失败：',err);
        }
    });
    //4.断开链接
    conn.end();
}
