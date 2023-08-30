import privacyBus from './privacyBus';

let privacyHandler
let privacyResolves = new Set()
let closeOtherPagePopUpHooks = new Set()

if (typeof wx.onNeedPrivacyAuthorization === 'function') {
    wx.onNeedPrivacyAuthorization(resolve => {
        if (typeof privacyHandler === 'function') {
            privacyHandler(resolve)
        }
    })
}

const closeOtherPagePopUp = (closePopUp) => {
    closeOtherPagePopUpHooks.forEach(hook => {
        if (closePopUp !== hook) {
            hook()
        }
    })
}

Component({
    properties: {
        auto: { // 自动检测
            type: Boolean,
            value: false
        },
    },
    data: {
        innerShow: false,
        title: "用户隐私保护指引",
    },
    /**
     * 组件的生命周期
     */
    pageLifetimes: {
        show() {
            if (this.data.auto) {
                if (typeof wx.getPrivacySetting === 'function') {
                    wx.getPrivacySetting({
                        success: (res) => {
                            if (res.errMsg == "getPrivacySetting:ok") {
                                this.setData({
                                    innerShow: res.needAuthorization
                                })
                            }
                        }
                    })
                }
            }
        }
    },
    lifetimes: {
        attached: function () {
            const closePopUp = () => {
                this.disPopUp()
            }
            privacyHandler = resolve => {
                privacyResolves.add(resolve)
                this.popUp()
                // 额外逻辑：当前页面的隐私弹窗弹起的时候，关掉其他页面的隐私弹窗
                closeOtherPagePopUp(closePopUp)
            }

            closeOtherPagePopUpHooks.add(closePopUp)

            this.closePopUp = closePopUp
        },
        detached: function () {
            closeOtherPagePopUpHooks.delete(this.closePopUp)
        }
    },
    methods: {
        handleAgree(e) {
            this.disPopUp()
            // 这里同时调用多个wx隐私接口时要如何处理：让隐私弹窗保持单例，点击一次同意按钮即可让所有pending中的wx隐私接口继续执行
            privacyResolves.forEach(resolve => {
                resolve({
                    event: 'agree',
                    buttonId: 'agree-btn'
                })
            })
            privacyResolves.clear()
            privacyBus.emit();
        },
        handleDisagree(e) {
            this.disPopUp()
            privacyResolves.forEach(resolve => {
                resolve({
                    event: 'disagree',
                })
            })
            privacyResolves.clear()
        },
        popUp() {
            if (this.data.innerShow === false) {
                this.setData({
                    innerShow: true
                })
            }
        },
        disPopUp() {
            if (this.data.innerShow === true) {
                this.setData({
                    innerShow: false
                })
            }
        },
        openPrivacyContract() {
            wx.openPrivacyContract({
                success: res => {
                    console.log('openPrivacyContract success')
                },
                fail: res => {
                    console.error('openPrivacyContract fail', res)
                }
            })
        }
    }
})