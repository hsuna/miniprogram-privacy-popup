App({
  onLaunch() {
  },
  onShow() {
    const version = wx.getAppBaseInfo().SDKVersion;
    console.log('version =>', version);
  }
})
