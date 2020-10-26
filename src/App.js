import React from 'react';
import ImageClip from './component/ImageClip';
// import './static/reset.min.css';
//import logo from './logo.svg';
import './App.css';
//import { render } from '@testing-library/react';

class App extends React.Component{
  constructor(props){
    super(props);

    // 初始状态
    this.state ={
      stage: 0,
      pic:''
    };
  }

  render(){

    let {stage, pic}=this.state;
    console.log(pic);
    return <main className="mainBox">

      {/* 点击上传图片 */}
      <div className ="baseInfo" style={{
        display: stage === 0?'block':'none'
      }}>


        {/* 图片框 */}
        <div className ="imgBox" 
          onClick = {ev =>{
            this.setState({ stage : 1 })
          }}>
          <img src={pic} alt ="" />
          <p>点击上传</p>
        </div>
      </div >


      {/* 图片上传与处理框 */}
      <div className="handleBox" style={{
        display: stage === 0 ?'none':'block'
      }}>
        <div className="returnBtn" >
          <span 
          onClick={ev =>{
          this.setState({ stage : 0 })
        }}>返回</span>
        </div>
      <ImageClip change={this.change}></ImageClip>
      </div>
    </main>
  }

  change = imagedata => {
    this.setState({
      stage: 0,
      pic: imagedata
    });
  }

}

export default App;