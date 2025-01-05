// index.js
const app = getApp()

Page({
  data: {
    errorMsg: '请选择两张清晰且带有人脸的图片。',
    icon: 'head.jpg',
    tu1: '/images/unload.png',
    tu2: '/images/unload.png',
    // rs : [{'no':1,'name':'加菲菲','score':93.6},
    //   {'no':2,'name':'神加菲','score':73.6},
    //   {'no':3,'name':'谋加菲','score':53.6},
    //   {'no':1,'name':'大菲菲','score':43.6},
    //   {'no':1,'name':'小菲菲','score':33.6},
    //   {'no':1,'name':'世菲菲','score':23.6}],
    rs : [],
    base641 : '',
    base642 : ''
  },

  //生命周期函数：出生323
  onLoad() {
    wx.setNavigationBarTitle({
      title: '人脸对比',
    })
  },

  async xuan1() {
    let f = await app.xuantu();
    // 设置选中的图片路径
    let ma  = await app.convert(f.path)
    // console.log('ma=' +ma)
    this.setData({
      tu1: f.path,
      base641 : ma,
    })
  },

  async xuan2() {
    let f = await app.xuantu();
    // 设置选中的图片路径
    let ma  = await app.convert(f.path)
    // console.log('ma=' +ma)
    this.setData({
      tu2: f.path,
      base642 : ma,
    })
  },

  async shibie(){
    //检查是否选过图片
    if (this.data.base641 == ''|| this.data.base642 == ''){
      wx.showToast({
        title: '你小子图放了吗',
        icon : 'error'
      })
      return
    }
    //把两张图片转换成json数组
    let jsonArray = [
      {'image':this.data.base641,'image_type':'BASE64'},
      {'image':this.data.base642,'image_type':'BASE64'}
    ]
    // let url = 'https://aip.baidubce.com/rest/2.0/face/v3/match?access_token='
    // let token = app.globalData.token
    wx.showLoading({
      title: '正在对比...',
      mask : true,
    })

    //发送网络请求（参数：网址，图片，令牌）
    let aaa = await app.facePost(jsonArray)
    console.log('结果='+JSON.stringify(aaa))
    let m = '这是同一个人'
    if(aaa < 40){
      m = '你眼瞎嘛，这分明不是一个人'
    }else if(aaa<60){
      m='这两个人长得有点像啊'
    }else if(aaa<85){
      m='这两个人长得也太像了吧'
    }

    this.setData({
      rs : m,
      base641:'',//清空图片数据
      base642:'',//清空图片数据
    })
  },
})