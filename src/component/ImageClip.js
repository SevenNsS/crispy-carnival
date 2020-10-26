import React from 'react';
class ImageClip extends React.Component{
    constructor(props){
        super(props);

        //=>Initialize CANVAS and MARK
        let winW = document.documentElement.clientWidth,  //需要修改
            ratio = window.ratio;
        let W = winW - 12 * ratio,    //MHMW调为组件尺寸
            H = W,
            MW = W * .7,
            MH = MW,
            ML = (W - MW) / 2,
            MT = (H - MH) / 2;
        this.state = {
            W, H, MW, MH, ML, MT,
            S: false
        }


    }
    render(){
        let { W, H, MW, MH, MT, ML, S } = this.state;

        return <div className="clipImageBox">
            <div className="canvasBoxDiv"
                onTouchStart={ev => {
                    let point = ev.changedTouches[0];
                    this.startX = point.clientX;
                    this.startY = point.clientY;
                }}
                onTouchMove={ev => {
                    let point = ev.changedTouches[0];
                    let changeX = point.clientX - this.startX,
                        changeY = point.clientY - this.startY;
                    if (Math.abs(changeX) > 10 || Math.abs(changeY) > 10) {
                        this.IL += changeX;
                        this.IT += changeY;
                        this.drawImage();
                        this.startX = point.clientX;
                        this.startY = point.clientY;
                    }
                }}
                onMouseDown={this.fnDown.bind(this)}
                onMouseUp={this.fnUp.bind(this)}
            >

                {/* 图片容器canvas */}
                <canvas className="canvasBox"
                    ref = {x => this._canvas = x}
                    width = {W}
                    height = {H}
                ></canvas>

                {/* 裁剪区域 */}
                <div className="mark"
                    style = {{
                        width: MW + 'px',
                        height: MH + 'px',
                        left: ML + 'px',
                        top: MT + 'px',
                        position: 'relative',                       
                        //display: 'block',
                        display: S ? 'block' : 'none'
                    }}></div>
            </div>
            <div className="buttonBox">
                <input  type ="file" accept="image/*" className="file"
                     ref = {x => this._file =x}
                     onChange = {this.fileChange}
                />

                <button className="choose"
                    style={{ display: 'none' }}  //隐藏重复按钮
                    onClick={ev => {
                        this._file.click();
                }}>选择图片</button>


                <button onClick={ev => {
                    if (!this.img) return;
                    this.IW += 10;
                    this.IH += 10;
                    this.drawImage();
                }}
                >放大</button>

                <button onClick={ev => {
                    if (!this.img) return;
                    this.IW -= 10;
                    this.IH -= 10;
                    this.drawImage();
                }}
                >缩小</button>
                
                <button className="submit" onClick={ev => {
                    if (!this.img) return;
                    let imagedata = this.ctx.getImageData(ML, MT, MW, MH),
                        canvas2 = document.createElement('canvas'),
                        ctx2 = canvas2.getContext('2d');
                    canvas2.width = MW;
                    canvas2.height = MH;
                    ctx2.putImageData(imagedata, 0, 0, 0, 0, MW, MH);
                    this.props.change(canvas2.toDataURL("image/png"));
                }}
                >上传图片</button>
            </div>
        </div>
    }

    // 获取上传图片,并渲染到canvas
    fileChange = () =>{
        this.setState({ S : true });
        let picOM = this._file.files[0];
        if(!picOM) return;

        // 从获取的图像中读取图片数据,即图片的BASE64码
        let fileReade = new FileReader();
        fileReade.readAsDataURL(picOM);
        fileReade.onload = ev =>{
            // 创建一张图片
            this.img =  new Image();
            this.img.src = ev.target.result;
            this.img.onload = () =>{
                let n=1,
                    {W, H} = this.state;
                this.IW = this.img.width;
                this.IH = this.img.height;
            
                // 修改的部分
                if(this.IW >this.IH){
                    n=this.IW / W;
                    this.IW = W;
                    this.IH =this.IH / n;
                }else{
                    n = this.IH / H;
                    this.IH =H;
                    this.IW =this.IW / n;
                }
                this.IL = (W-this.IW)/2;
                this.IT = (H-this.IH)/2;

                 // 将图片绘制到canvas
                this.drawImage();
            };
        } 
    }

    // 图片绘制
    drawImage = () => {
        let { W, H } = this.state;
        this.ctx = this._canvas.getContext('2d');
        this.ctx.clearRect(0, 0, W, H);
        this.ctx.drawImage(this.img, this.IL, this.IT, this.IW, this.IH);
    }



    //鼠标按下，记录拖拽起始位置，鼠标按下时document绑定onmousemove事件，实时改变元素的布局style
    fnDown(e) {
        this.startX = e.clientX ;
        this.startY = e.clientY ;
        document.onmousemove = this.fnMove.bind(this)
    }

    //鼠标移动
    fnMove(e) {
        let changeX = e.clientX - this.startX,
            changeY = e.clientY - this.startY;
        if (Math.abs(changeX) > 10 || Math.abs(changeY) > 10) {
            this.IL += changeX;
            this.IT += changeY;
            this.drawImage();
            this.startX = e.clientX;
            this.startY = e.clientY;
        }
    }

    //鼠标抬起，鼠标放开时document移除onmousemove事件
    fnUp() {
        document.onmousemove = null
    }
    
}

export default ImageClip;