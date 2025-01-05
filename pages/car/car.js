const app=getApp()
Page({
  data: {
    icon:'head.jpg',
    errorMsg:'请选择一张清晰且带有车的图片',
    tu:'/images/unload.png',
    // rs:[{'no':1,'name':'加菲猫','score':96.3},{'no':2,'name':'英国短毛猫','score':43.5}]
    rs:[],
    base64:''//图片的数据
  },


// 生命周期
  onLoad (){
    wx.setNavigationBarTitle({
      title: '车识别',   
    })
  },

 async xuan(){
    let f=await app.xuantu()
    //转码
    let ma=await app.convert(f.path)
    // console.log('ma='+ma)
    this.setData({
      tu:f.path,
      base64:ma,
    })
  },

  async shibie(){
    //检查是否选过图片
    if(this.data.base64=='')
    {
      wx.showToast({
        title: '没图不能识别哈',
        icon : 'error'
      })
      return 
    }
    let url='https://aip.baidubce.com/rest/2.0/image-classify/v1/car'
    let token=app.globalData.token
    wx.showLoading({
      title: '正在识别',
      mask:true,
    })

    //发网络请求 网址图片令牌999000.
    let aaa=await app.post(url,this.data.base64,token)
    console.log('结果='+JSON.stringify(aaa))
    // let temp=[]

    this.setData({
      rs : aaa,
      base64:'',//清空图片数据
    })
  },
})

