let studentsList = [];          //ES6 可以使用 let 关键字来实现块级作用域。let 声明的变量只在 let 命令所在的代码块 {} 内有效，在 {} 之外不能访问。
                                //使用 var 关键字声明的变量不具备块级作用域的特性，它在 {} 外依然能被访问到。
                                //[]定义数组，{}定义对象
function getStudents(){         //定义函数

    //FetchAPI
    //Fetch always return Promise with resolve
    fetch('http://localhost:3000/contacts').then(response =>{   //fetch()到一个promise对象，然后调用promise对象的then方法，它的作用是为 Promise 实例添加状态改变时的回调函数。then方法的第一个参数是resolved状态的回调函数，第二个参数（可选）是rejected状态的回调函数。
        //console.log(response);方法用于在控制台输出信息
        if(response.ok){
          // console.log(response.json());
            return response.json();                 //通过网络获取一个JSON文件，res.json（）/res.text（）获取到的是一个新的promise实例，arr.txt的值在[[[PromiseValue]]里面，但是直接取是取不出来的。没有方法取出来，Promise的设计文档中说了，[[PromiseValue]]是个内部变量，外部无法得到，只能在then中获取。所以就会用到第二次then了
                                                    //response是只能被读取一次的,console.log取一次，return取一次，会报错
        }
        else{
            if(response.status == 404){
                return Promise.reject(new Error('InValid URL..'))
            }
           else if(response.status == 500){
                return Promise.reject(new Error('Some Internal Error Occured...'));
            }
           else if(response.status == 401){
            return Promise.reject(new Error('UnAuthorized User..'));
           }
        }
        
    }).then(studentsListResponse =>{               //第一个then的return返回值是一个promise实例对象，所以回调链转交给了新的实例对象，第二个then的回调函数参数为PromiseValue的值。当返回值不是对象是数据类型时，会将该返回值赋值给PromiseValue，供下次的then函数使用
                                                   //studentsListResponse是上一个then()return的promise的对象
        studentsList = studentsListResponse;
       // console.log('studentsList', studentsList);
       displayReposToHTML(studentsListResponse);
    }).catch(error =>{
        let errorEle = document.getElementById('errMessage');
        errorEle.innerText = error.message;         //错误处理，这里有一个疑问，上面的response.ok==false跟下面的error有什么区别呢？
    })

}

function getStudentsByName(event){     
    event.preventDefault();    
    let name =  document.getElementById('name2').value;

    //FetchAPI
    //Fetch always return Promise with resolve
    fetch('http://localhost:3000/contacts').then(response =>{   
        if(response.ok){
          // console.log(response.json());
            return response.json();                 
        }
        else{
            if(response.status == 404){
                return Promise.reject(new Error('InValid URL..'))
            }
           else if(response.status == 500){
                return Promise.reject(new Error('Some Internal Error Occured...'));
            }
           else if(response.status == 401){
            return Promise.reject(new Error('UnAuthorized User..'));
           }
        }
        
    }).then(studentsListResponse =>{               
        studentsList = studentsListResponse;
       // console.log('studentsList', studentsList);
        let tableEle = document.getElementsByTagName('table')[0];               
        let tbodyEle = tableEle.getElementsByTagName('tbody')[0];            
        
        let tbodyEleInnerHTMLString = '';                                       

        studentsListResponse.forEach(student =>{
            if(student.name == name){
                tbodyEleInnerHTMLString += `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                        <td>${student.contactno}</td>
                        <td><button class='btn btn-primary' type='button' onclick='displayModal(${student.id})'>Update</button></td>
                        <td ><i class='fa fa-trash' style='color:red;font-size:1.2em;cursor:pointer' onclick='deleteStudent(${student.id})'></i></td>       
                    </tr>
                    `; 
            } 
            else if(student.name != name){
                let alertEle = document.getElementById('alert');
                alertEle.innerText = "未找到相关信息";
            }                                                           
        });

        tbodyEle.innerHTML = tbodyEleInnerHTMLString;
        
        $('#table-body').html(tbodyEle.innerHTML);

        }).catch(error =>{
            let errorEle = document.getElementById('errMessage');
            errorEle.innerText = error.message;         
        })

}


function displayReposToHTML(studentsListResponse){
    //logic
    //console.log('Response',repositoriesList);
  // let tableEle =  document.getElementById('repo-list-table');
    let tableEle = document.getElementsByTagName('table')[0];               //每个载入浏览器的 HTML 文档都会成为 Document 对象。Document 对象使我们可以从脚本中对 HTML 页面中的所有元素进行访问。getElementsByTagName() 方法可返回带有指定标签名的对象的集合。这里返回html文件中第一个table标签对象（element对象）。

    let tbodyEle = tableEle.getElementsByTagName('tbody')[0];               //在 HTML DOM 中，Element 对象表示 HTML 元素。 Element 对象可以拥有类型为元素节点、文本节点、注释节点的子节点。
  //console.log(tbodyEle);
    let tbodyEleInnerHTMLString = '';                                       //定义字符串，用来储存表格中的内容，起始为空，经过下面处理后变成所有表格内数据连在一起组成的字符串（存疑）

    studentsListResponse.forEach(student =>{
   //     console.log(repo.web_url + '--'+repo.owner.username );
     tbodyEleInnerHTMLString += `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.contactno}</td>
                    <td><button class='btn btn-primary' type='button' onclick='displayModal(${student.id})'>Update</button></td>
                    <td ><i class='fa fa-trash' style='color:red;font-size:1.2em;cursor:pointer' onclick='deleteStudent(${student.id})'></i></td>       
                </tr>
     `;                                                                     //.fa class设置字体图标
    });

    tbodyEle.innerHTML = tbodyEleInnerHTMLString;                           //innerHTML 属性设置或返回元素的 inner HTML。
   
    
}


//adding student to db
function addStudent(event){
    event.preventDefault();                                                //event.preventDefault通知浏览器不要执行与事件关联的默认动作。
  //  console.log('addStudent');
 let name =  document.getElementById('name').value;
 let email = document.getElementById('email').value;
 let contactno = document.getElementById('contactno').value;               

 let student = {
     name : name,
     email : email,
     contactno: contactno
 }                                                                         //获取用户输入并将其放到一个student对象中

 //console.log(name + ' --' + email + " ---" + contactno);
  fetch('http://localhost:3000/contacts',{                                 //fetch() 接受第二个可选参数，一个可以控制不同配置的 init 对象，如：method: 请求使用的方法，如 GET、POST；headers: 请求的头信息，形式为 Headers 的对象或包含 ByteString 值的对象字面量。
      method: 'POST',                                                      //method-get	请求指定的页面信息，并返回实体主体。
                                                                           //method-post 向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。POST请求可能会导致新的资源的建立和/或已有资源的修改。
                                                                           //method-put 从客户端向服务器传送的数据取代指定的文档的内容。
      headers:{
        'content-type': 'application/json'                                 //设置返回的数据类型为json
      },
      body:JSON.stringify(student)                                         //body: 请求的 body 信息：可能是一个 Blob、BufferSource、FormData、URLSearchParams 或者 USVString 对象。注意 GET 或 HEAD 方法的请求不能包含 body 信息。
                                                                           //这里请求的body信息是转化为json格式的（原本为js对象）student
  }).then(response =>{
      if(response.ok){
          return response.json();
      }
      else{
          return Promise.reject(new Error('Some internal error occured...'))
      }
  }).then(addedStudent =>{
      console.log('addedStudent -->', addedStudent);
    //   let tableEle = document.getElementsByTagName('table')[0];

    //   let tbodyEle = tableEle.getElementsByTagName('tbody')[0];

    //   console.log(tbodyEle.innerHTML);
        let tbodyEle = document.getElementById('table-body');
        console.log(tbodyEle);                                          //在控制台输出所加入的学生信息和学生信息表格
        
      
      
  }).catch(error=>{
    //ADd this to html
    let errorEle = document.getElementById('errMessage');
        errorEle.innerText = error.message;
  })
}

function deleteStudent(id){
    console.log('delete Student--',id);
    
    fetch(`http://localhost:3000/contacts/${id}`,{
        method:'DELETE'
    }).then(response =>{
        if(response.ok){
            return response.json();
        }
    }).then(result =>{
        console.log('result from delete',result);
        //write the code for DOM manipulation
    })
    location.reload();
}

function displayModal(id){
    $('#myModal').modal();
    $('#id1').attr('value',id);
    fetch(`http://localhost:3000/contacts/${id}`).then(response =>{   
    
    if(response.ok){
      // console.log(response.json());
        return response.json();            
    }
    else{
        if(response.status == 404){
            return Promise.reject(new Error('InValid URL..'))
        }
       else if(response.status == 500){
            return Promise.reject(new Error('Some Internal Error Occured...'));
        }
       else if(response.status == 401){
        return Promise.reject(new Error('UnAuthorized User..'));
       }
    }
    
    }).then(studentResponse =>{               

        student= studentResponse;
        // console.log('studentsList', studentsList);
        $('#name1').attr('value',student.name);
        $('#email1').attr('value',student.email);
        $('#contactno1').attr('value',student.contactno);
    }).catch(error =>{
        let errorEle = document.getElementById('errMessage');
        errorEle.innerText = error.message;         //错误处理，这里有一个疑问，上面的response.ok==false跟下面的error有什么区别呢？
    })

}

function updateStudent(event){
    event.preventDefault();                                        //event.preventDefault通知浏览器不要执行与事件关联的默认动作。
   let id =  document.getElementById('id1').value;
   let name =  document.getElementById('name1').value;
   let email = document.getElementById('email1').value;
   let contactno = document.getElementById('contactno1').value;               
  
   let student = {
       name : name,
       email : email,
       contactno: contactno
   }   
  
    fetch(`http://localhost:3000/contacts/${id}`,{                                 //fetch() 接受第二个可选参数，一个可以控制不同配置的 init 对象，如：method: 请求使用的方法，如 GET、POST；headers: 请求的头信息，形式为 Headers 的对象或包含 ByteString 值的对象字面量。
        method: 'PUT',                                                      //method-get	请求指定的页面信息，并返回实体主体。
                                                                             //method-post 向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。POST请求可能会导致新的资源的建立和/或已有资源的修改。
                                                                             //method-put 从客户端向服务器传送的数据取代指定的文档的内容。
        headers:{
          'content-type': 'application/json'                                 //设置返回的数据类型为json
        },
        body:JSON.stringify(student)                                         //body: 请求的 body 信息：可能是一个 Blob、BufferSource、FormData、URLSearchParams 或者 USVString 对象。注意 GET 或 HEAD 方法的请求不能包含 body 信息。
                                                                             //这里请求的body信息是转化为json格式的（原本为js对象）student
    }).then(response =>{
        if(response.ok){
            return response.json();
        }
        else{
            return Promise.reject(new Error('Some internal error occured...'))
        }
    }).then(updatedStudent =>{
        console.log('addedStudent -->', updatedStudent);
      //   let tableEle = document.getElementsByTagName('table')[0];
  
      //   let tbodyEle = tableEle.getElementsByTagName('tbody')[0];
  
      //   console.log(tbodyEle.innerHTML);
          let tbodyEle = document.getElementById('table-body');
          console.log(tbodyEle);                                          //在控制台输出所加入的学生信息和学生信息表格
          
        
        
    }).catch(error=>{
      //ADd this to html
      let errorEle = document.getElementById('errMessage');
          errorEle.innerText = error.message;
    })
    location.reload();
}
